import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  Save, 
  Trash2, 
  Download, 
  Plus, 
  Minus, 
  Calculator,
  Building2,
  User,
  Calendar,
  Hash,
  Percent,
  FileIcon,
  Shield,
  LogOut,
  CheckCircle,
  AlertCircle,
  Euro
} from 'lucide-react';

declare global {
  interface Window {
    google: any;
    jsPDF: any;
  }
}

const RechnungsGenerator = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [formData, setFormData] = useState({
    company: '',
    client: '',
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    vatRate: 20,
    footerNote: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const googleSignInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Passwort-Schutz
    const pass = prompt("Passwort eingeben:");
    if (pass !== "Teufeline2028!!!") {
      alert("Falsches Passwort!");
      window.history.back(); // Zurück zur vorherigen Seite statt zur Startseite
      return;
    }

    // Load Google APIs
    const script1 = document.createElement('script');
    script1.src = 'https://accounts.google.com/gsi/client';
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
    document.head.appendChild(script3);

    script1.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '571339195704-h27i7flf8fp0l46enksh7hthe7rvp37d.apps.googleusercontent.com',
          callback: handleCredentialResponse
        });
        
        if (googleSignInRef.current) {
          window.google.accounts.id.renderButton(
            googleSignInRef.current,
            { theme: "outline", size: "large", text: "signin_with", width: 220 }
          );
        }

        // Initialize OAuth2 token client
        const newTokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: '571339195704-h27i7flf8fp0l46enksh7hthe7rvp37d.apps.googleusercontent.com',
          scope: 'https://www.googleapis.com/auth/drive.file',
          callback: (tokenResponse: any) => {
            setGoogleAccessToken(tokenResponse.access_token);
            loadClients();
            toast({
              title: "Mit Google Drive verbunden",
              description: "Sie können jetzt Kunden speichern und laden",
            });
          }
        });
        setTokenClient(newTokenClient);
      }
    };

    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1);
      if (document.head.contains(script2)) document.head.removeChild(script2);
      if (document.head.contains(script3)) document.head.removeChild(script3);
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    const userObject = parseJwt(response.credential);
    setGoogleUser(userObject);
    document.getElementById('googleSignInBtn')!.style.display = 'none';
    setIsLoggedIn(true);
    
    // Request access token for Drive API
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
    
    toast({
      title: "Erfolgreich angemeldet",
      description: `Angemeldet als ${userObject.email}`,
    });
  };

  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const signOut = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setGoogleUser(null);
    setGoogleAccessToken(null);
    setIsLoggedIn(false);
    setClients([]);
    setSelectedClient('');
    if (googleSignInRef.current) {
      googleSignInRef.current.style.display = 'inline-block';
    }
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet",
    });
  };

  // Google Drive API functions
  const findFileId = async (name: string): Promise<string | null> => {
    if (!googleAccessToken) return null;
    
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files?q=' +
        encodeURIComponent(`name='${name}' and trashed=false`) +
        '&fields=files(id,name)', {
          headers: { Authorization: 'Bearer ' + googleAccessToken }
        });
      const data = await response.json();
      return data.files && data.files[0] ? data.files[0].id : null;
    } catch (error) {
      console.error('Error finding file:', error);
      return null;
    }
  };

  const saveFileAsPDF = async (name: string, pdfBlob: Blob) => {
    if (!googleAccessToken) {
      toast({
        title: "Fehler",
        description: "Bitte anmelden!",
        variant: "destructive"
      });
      return;
    }

    try {
      const metadata = { name: name, mimeType: 'application/pdf' };
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', pdfBlob);

      const existingId = await findFileId(name);
      if (existingId) {
        await fetch('https://www.googleapis.com/upload/drive/v3/files/' + existingId + '?uploadType=multipart', {
          method: 'PATCH',
          headers: { Authorization: 'Bearer ' + googleAccessToken },
          body: form
        });
      } else {
        await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + googleAccessToken },
          body: form
        });
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern in Google Drive",
        variant: "destructive"
      });
    }
  };

  const loadClients = async () => {
    if (!googleAccessToken) return;
    
    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files?q=' +
        encodeURIComponent(`name contains 'Rechnung_' and mimeType='application/pdf' and trashed=false`) +
        '&fields=files(id,name)', {
          headers: { Authorization: 'Bearer ' + googleAccessToken }
        });
      const data = await response.json();
      
      if (data.files) {
        const clientNames = data.files
          .map((file: any) => {
            const match = file.name.match(/^Rechnung_(.+)_RE-/);
            return match ? match[1] : null;
          })
          .filter((name: string | null) => name !== null)
          .filter((name: string, index: number, self: string[]) => self.indexOf(name) === index);
        
        setClients(clientNames);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const saveClient = async () => {
    if (!isLoggedIn || !googleAccessToken) {
      toast({
        title: "Fehler",
        description: "Bitte zuerst anmelden!",
        variant: "destructive"
      });
      return;
    }

    if (!formData.client) {
      toast({
        title: "Fehler",
        description: "Bitte Kundennamen eingeben",
        variant: "destructive"
      });
      return;
    }

    try {
      const pdfBlob = await generatePDF({ saveOnly: true });
      if (pdfBlob) {
        const invoiceNumber = formData.invoiceNumber || getNextInvoiceNumber();
        const pdfName = `Rechnung_${formData.client}_${invoiceNumber}.pdf`;
        await saveFileAsPDF(pdfName, pdfBlob);
        
        toast({
          title: "Erfolg",
          description: "Kunde gespeichert (PDF in Google Drive)!",
        });
        
        // Reload clients list
        loadClients();
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Fehler",
        description: "Fehler beim Speichern des Kunden",
        variant: "destructive"
      });
    }
  };

  const deleteClient = async () => {
    if (!selectedClient || !googleAccessToken) {
      toast({
        title: "Fehler",
        description: "Bitte Kunden auswählen",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Alle Rechnungen für Kunde "${selectedClient}" löschen?`)) {
      return;
    }

    try {
      const response = await fetch('https://www.googleapis.com/drive/v3/files?q=' +
        encodeURIComponent(`name contains 'Rechnung_${selectedClient}_' and mimeType='application/pdf' and trashed=false`) +
        '&fields=files(id,name)', {
          headers: { Authorization: 'Bearer ' + googleAccessToken }
        });
      const data = await response.json();
      
      if (data.files) {
        for (const file of data.files) {
          await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + googleAccessToken }
          });
        }
      }

      toast({
        title: "Erfolg",
        description: `Kunde "${selectedClient}" wurde gelöscht`,
      });
      
      setSelectedClient('');
      setFormData({ ...formData, client: '' });
      loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Fehler",
        description: "Fehler beim Löschen des Kunden",
        variant: "destructive"
      });
    }
  };

  const fillClientFromSelect = (clientName: string) => {
    if (clientName === "new-client") {
      setSelectedClient('');
      setFormData({ ...formData, client: '' });
    } else {
      setSelectedClient(clientName);
      setFormData({ ...formData, client: clientName });
    }
  };

  const updateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const vatAmount = subtotal * formData.vatRate / 100;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  };

  const addRow = () => {
    setItems([...items, { desc: '', qty: 1, price: 0 }]);
  };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    } else {
      setItems([{ desc: '', qty: 1, price: 0 }]);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getNextInvoiceNumber = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const key = `lastInvoice-${y}-${m}`;
    let n = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, n.toString());
    return `RE-${y}${m}-${String(n).padStart(3, '0')}`;
  };

  const generatePDF = async (options?: { saveOnly?: boolean }): Promise<Blob | void> => {
    if (!formData.company || !formData.client || !formData.date) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus",
        variant: "destructive"
      });
      return;
    }

    const validItems = items.filter(item => item.desc.trim() && item.price > 0);
    if (validItems.length === 0) {
      toast({
        title: "Fehler", 
        description: "Mindestens eine Position mit Preis > 0 erforderlich",
        variant: "destructive"
      });
      return;
    }

    if (!window.jsPDF) {
      toast({
        title: "Fehler",
        description: "PDF-Bibliothek noch nicht geladen",
        variant: "destructive"
      });
      return;
    }

    const { jsPDF } = window;
    const doc = new jsPDF();
    const invoiceNumber = formData.invoiceNumber || getNextInvoiceNumber();
    const { subtotal, vatAmount, total } = updateTotals();

    // Logo hinzufügen falls vorhanden
    if (logoPreview) {
      try {
        const img = new Image();
        img.src = logoPreview;
        await new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        if (img.width > 0) {
          const aspectRatio = img.height / img.width;
          const logoWidth = 50;
          const logoHeight = logoWidth * aspectRatio;
          doc.addImage(img, 'PNG', 15, 15, logoWidth, logoHeight);
        }
      } catch (error) {
        console.log('Logo could not be added:', error);
      }
    }

    // Header
    let y = 15;
    doc.setFontSize(18);
    doc.text('RECHNUNG', 205, y, { align: 'right' });
    y += 10;
    doc.setFontSize(10);
    doc.text(`Rechnungsnr: ${invoiceNumber}`, 205, y, { align: 'right' });
    y += 6;
    doc.text(`Datum: ${formData.date}`, 205, y, { align: 'right' });
    y += 15;

    // Company and client info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.company, 15, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text('Rechnung an: ' + formData.client, 15, y);
    y += 20;

    // Items table
    const headers = [['Pos', 'Beschreibung', 'Menge', 'Einzelpreis', 'Gesamt']];
    const rows = validItems.map((item, i) => [
      i + 1,
      item.desc,
      item.qty,
      item.price.toFixed(2).replace('.', ','),
      (item.qty * item.price).toFixed(2).replace('.', ',')
    ]);

    doc.autoTable({
      startY: y,
      head: headers,
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 
        0: { cellWidth: 15 }, 
        1: { cellWidth: 80 }, 
        2: { cellWidth: 20 }, 
        3: { cellWidth: 30 }, 
        4: { cellWidth: 30 } 
      }
    });

    // Summary
    y = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Zwischensumme: ${subtotal.toFixed(2).replace('.', ',')} €`, 205, y, { align: 'right' });
    y += 7;
    doc.text(`MwSt (${formData.vatRate}%): ${vatAmount.toFixed(2).replace('.', ',')} €`, 205, y, { align: 'right' });
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text(`Gesamtsumme: ${total.toFixed(2).replace('.', ',')} €`, 205, y, { align: 'right' });

    // Footer
    if (formData.footerNote) {
      y += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.footerNote, 15, y);
    }

    if (options?.saveOnly) {
      return new Promise(resolve => {
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
      });
    } else {
      doc.save(`Rechnung_${invoiceNumber}.pdf`);
      toast({
        title: "Erfolg",
        description: "Rechnung wurde erstellt",
      });
    }
  };

  const totals = updateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-elegant">
            <Calculator className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Professioneller Rechnungs-Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Erstellen Sie professionelle Rechnungen mit Google Drive Integration
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Authentication & Client Management */}
          <div className="lg:col-span-1 space-y-6">
            {/* Authentication Card */}
            <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  Authentifizierung
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-accent" />
                        <span className="text-sm font-medium">Nicht angemeldet</span>
                      </div>
                      <div ref={googleSignInRef} className="w-full"></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Melden Sie sich an, um Kunden zu speichern und zu verwalten.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-5 h-5 text-secondary" />
                        <span className="text-sm font-medium">Verbunden</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {googleUser?.email}
                      </p>
                      <Button onClick={signOut} variant="outline" size="sm" className="w-full">
                        <LogOut className="w-4 h-4 mr-2" />
                        Abmelden
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client Management Card */}
            <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-primary" />
                  Kundenverwaltung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Kunde auswählen</Label>
                  <Select
                    value={selectedClient}
                    onValueChange={fillClientFromSelect}
                    disabled={!isLoggedIn}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Neuen Kunden anlegen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-client">Neuen Kunden anlegen</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Kundenname <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="z.B. Max Mustermann GmbH"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={saveClient} 
                    disabled={!isLoggedIn || !formData.client}
                    size="sm"
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Speichern
                  </Button>
                  <Button 
                    onClick={deleteClient} 
                    disabled={!isLoggedIn || !selectedClient}
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Löschen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Invoice Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-6 h-6 text-primary" />
                  Rechnungsdetails
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">

                {/* Basic Information Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Upload className="w-4 h-4" />
                        Firmenlogo (optional)
                      </Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        />
                      </div>
                      {logoPreview && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <img
                            src={logoPreview}
                            alt="Logo Vorschau"
                            className="max-w-32 max-h-16 object-contain mx-auto"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Invoice Date */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        Rechnungsdatum <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="w-4 h-4" />
                      Ihr Firmenname <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="z.B. Ihre Firma GmbH"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Invoice Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Hash className="w-4 h-4" />
                        Rechnungsnummer (optional)
                      </Label>
                      <Input
                        placeholder="Wird automatisch generiert"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Percent className="w-4 h-4" />
                        Mehrwertsteuer (%)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.vatRate}
                        onChange={(e) => setFormData({ ...formData, vatRate: parseFloat(e.target.value) || 20 })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Invoice Items Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FileIcon className="w-5 h-5 text-primary" />
                    Rechnungspositionen
                  </h3>
                  
                  <div className="bg-muted/30 rounded-lg p-1 border border-border/50">
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="bg-card/80 rounded-lg p-4 border border-border/50 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Description */}
                            <div className="md:col-span-5">
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Beschreibung <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                value={item.desc}
                                onChange={(e) => updateItem(index, 'desc', e.target.value)}
                                placeholder="Leistungsbeschreibung eingeben..."
                                className="w-full"
                                required
                              />
                            </div>
                            
                            {/* Quantity */}
                            <div className="md:col-span-2">
                              <Label className="text-xs text-muted-foreground mb-1 block">Menge</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                                className="w-full text-center"
                              />
                            </div>
                            
                            {/* Price */}
                            <div className="md:col-span-2">
                              <Label className="text-xs text-muted-foreground mb-1 block">
                                Preis (€) <span className="text-destructive">*</span>
                              </Label>
                              <div className="relative">
                                <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={item.price}
                                  onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                                  className="pl-10 w-full text-right"
                                  required
                                />
                              </div>
                            </div>
                            
                            {/* Total */}
                            <div className="md:col-span-2">
                              <Label className="text-xs text-muted-foreground mb-1 block">Gesamt</Label>
                              <div className="bg-muted/50 border border-border rounded-md px-3 py-2 text-right font-medium">
                                {(item.qty * item.price).toFixed(2)} €
                              </div>
                            </div>
                            
                            {/* Action */}
                            <div className="md:col-span-1 flex justify-center">
                              <Button
                                onClick={() => removeRow(index)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-8 h-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button onClick={addRow} className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Neue Position hinzufügen
                  </Button>
                </div>

                <Separator />

                {/* Invoice Summary */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Rechnungssumme
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Zwischensumme:</span>
                      <span className="font-semibold text-lg">{totals.subtotal.toFixed(2)} €</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">
                        MwSt. ({formData.vatRate}%):
                      </span>
                      <span className="font-semibold text-lg">{totals.vatAmount.toFixed(2)} €</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center py-3 bg-primary/10 rounded-lg px-4">
                      <span className="text-xl font-bold text-primary">Gesamtsumme:</span>
                      <span className="text-2xl font-bold text-primary">
                        {totals.total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Zusätzliche Informationen</Label>
                  <Textarea
                    rows={4}
                    placeholder="Bankverbindung, Zahlungsbedingungen, Anmerkungen..."
                    value={formData.footerNote}
                    onChange={(e) => setFormData({ ...formData, footerNote: e.target.value })}
                    className="resize-none"
                  />
                </div>

                {/* Generate PDF Button */}
                <div className="pt-4">
                  <Button 
                    onClick={() => generatePDF()} 
                    className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity shadow-elegant"
                    size="lg"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Professionelle PDF-Rechnung erstellen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechnungsGenerator;