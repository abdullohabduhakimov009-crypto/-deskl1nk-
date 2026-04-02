import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface POData {
  poNumber: string;
  quoteRef: string;
  date: string;
  client: {
    name: string;
    address: string;
  };
  requester: {
    company: string;
    contact: string;
    phone: string;
  };
  items: {
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }[];
  summary: {
    subtotal: number;
    vat: number;
    shipping: number;
    total: number;
    currency: string;
  };
  notes?: string;
}

const COMPANY_INFO = {
  name: "Desknet Global Solutions",
  address: "100 Tech Plaza, Suite 500, San Francisco, CA 94105",
  phone: "+1 (888) DESKNET",
  email: "hello@desknet.io"
};

const drawLogo = (doc: jsPDF, x: number, y: number, size: number = 12) => {
  const s = size / 100; // scale factor
  
  // Draw Stylized 'D'
  doc.setDrawColor(45, 212, 191); // brand-teal
  doc.setLineWidth(s * 6);
  
  doc.moveTo(x + 35 * s, y + 25 * s);
  doc.curveTo(x + 30 * s, y + 25 * s, x + 30 * s, y + 30 * s, x + 30 * s, y + 35 * s);
  doc.lineTo(x + 30 * s, y + 65 * s);
  doc.curveTo(x + 30 * s, y + 70 * s, x + 30 * s, y + 75 * s, x + 35 * s, y + 75 * s);
  doc.lineTo(x + 55 * s, y + 75 * s);
  doc.curveTo(x + 70 * s, y + 75 * s, x + 80 * s, y + 65 * s, x + 80 * s, y + 50 * s);
  doc.curveTo(x + 80 * s, y + 35 * s, x + 70 * s, y + 25 * s, x + 55 * s, y + 25 * s);
  doc.lineTo(x + 35 * s, y + 25 * s);
  doc.stroke();

  // Draw 'N'
  doc.setDrawColor(15, 23, 42); // slate-900
  doc.setLineWidth(s * 4);
  doc.moveTo(x + 45 * s, y + 60 * s);
  doc.lineTo(x + 45 * s, y + 40 * s);
  doc.lineTo(x + 65 * s, y + 60 * s);
  doc.lineTo(x + 65 * s, y + 40 * s);
  doc.stroke();

  // Accent Dot
  doc.setFillColor(45, 212, 191);
  doc.circle(x + 80 * s, y + 50 * s, s * 3, 'F');
};

export interface JobHistoryItem {
  jobId: string;
  subject: string;
  client: string;
  engineer: string;
  type: string;
  completedDate: string;
  description?: string;
  specialInstructions?: string;
  engineerEmail?: string;
  engineerPhone?: string;
  quoteAmount?: string;
  quoteDescription?: string;
  updates?: {
    text: string;
    timestamp: any;
    author: string;
  }[];
}

export const generateJobHistoryPDF = (items: JobHistoryItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Header
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  drawLogo(doc, margin, 25, 12);

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 15, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.text("GLOBAL SOLUTIONS", margin + 15, 41);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("COMPLETED JOBS HISTORY", pageWidth - margin, 38, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 45, { align: 'right' });

  // Summary Table
  const tableData = items.map(item => [
    item.jobId,
    item.subject,
    item.client,
    item.engineer,
    item.type,
    item.completedDate
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['JOB ID', 'SUBJECT', 'CLIENT', 'ENGINEER', 'TYPE', 'COMPLETED']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25 }
    }
  });

  // Detailed View for each job
  let currentY = (doc as any).lastAutoTable.finalY + 20;

  items.forEach((item, index) => {
    // Check if we need a new page for the detailed section
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`JOB DETAILS: ${item.jobId} - ${item.subject}`, margin + 5, currentY + 7);
    
    currentY += 15;

    // Description & Special Instructions
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text("DESCRIPTION:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(item.description || 'N/A', pageWidth - (margin * 2) - 10);
    doc.text(splitDesc, margin, currentY + 6);
    currentY += (splitDesc.length * 5) + 10;

    if (item.specialInstructions) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text("SPECIAL INSTRUCTIONS:", margin, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const splitInstr = doc.splitTextToSize(item.specialInstructions, pageWidth - (margin * 2) - 10);
      doc.text(splitInstr, margin, currentY + 6);
      currentY += (splitInstr.length * 5) + 10;
    }

    // Engineer & Quotation Info (Two Columns)
    const colWidth = (pageWidth - (margin * 2)) / 2;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("ENGINEER DETAILS:", margin, currentY);
    doc.text("QUOTATION INFO:", margin + colWidth, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Name: ${item.engineer}`, margin, currentY + 6);
    doc.text(`Email: ${item.engineerEmail || 'N/A'}`, margin, currentY + 11);
    doc.text(`Phone: ${item.engineerPhone || 'N/A'}`, margin, currentY + 16);
    
    doc.text(`Amount: ${item.quoteAmount || 'N/A'}`, margin + colWidth, currentY + 6);
    const splitQuoteDesc = doc.splitTextToSize(item.quoteDescription || 'N/A', colWidth - 10);
    doc.text(splitQuoteDesc, margin + colWidth, currentY + 11);
    
    currentY += Math.max(25, 11 + (splitQuoteDesc.length * 5)) + 10;

    // Updates / Comments
    if (item.updates && item.updates.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text("TICKET UPDATES & COMMENTS:", margin, currentY);
      currentY += 8;

      item.updates.forEach((update) => {
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 30;
        }
        
        const dateStr = typeof update.timestamp === 'string' ? new Date(update.timestamp).toLocaleString() : 'N/A';
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 212, 191);
        doc.text(`${update.author} - ${dateStr}`, margin, currentY);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        const splitUpdate = doc.splitTextToSize(update.text, pageWidth - (margin * 2) - 10);
        doc.text(splitUpdate, margin, currentY + 5);
        currentY += (splitUpdate.length * 5) + 10;
      });
    }

    currentY += 10;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`Desknet_Job_History_${new Date().toISOString().split('T')[0]}.pdf`);
};

export interface ClientListItem {
  name: string;
  company: string;
  email: string;
  location: string;
  size: string;
  status: string;
  joined: string;
  phone?: string;
  industry?: string;
}

export interface EngineerListItem {
  name: string;
  email: string;
  location: string;
  technicianType: string;
  serviceType: string;
  level: string;
  experience: string;
  languages: string;
  status: string;
  joined: string;
  phone?: string;
  bio?: string;
  hourlyRate?: string;
  halfDayRate?: string;
  fullDayRate?: string;
  specialization?: string;
  whatsapp?: string;
  skills?: string[];
  totalCompleted?: number;
  thisMonthCompleted?: number;
  paymentDetails?: {
    method: string;
    accountType: string;
    currency: string;
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    swiftCode: string;
    routingNumber?: string;
  };
  hasCV?: boolean;
}

export interface StaffListItem {
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

export const generateStaffListPDF = (staff: StaffListItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  drawLogo(doc, margin, 25, 12);

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 15, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.text("GLOBAL SOLUTIONS", margin + 15, 41);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("STAFF LIST REPORT", pageWidth - margin, 38, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 45, { align: 'right' });

  const tableData = staff.map(s => [
    s.name,
    s.email,
    s.role,
    s.status,
    s.joined
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['NAME', 'EMAIL', 'ROLE', 'STATUS', 'JOINED']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 7,
      cellPadding: 2
    }
  });

  doc.save(`Desknet_Staff_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateEngineerListPDF = (engineers: EngineerListItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Header
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  drawLogo(doc, margin, 25, 12);

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 15, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.text("GLOBAL SOLUTIONS", margin + 15, 41);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("ENGINEER LIST REPORT", pageWidth - margin, 38, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 45, { align: 'right' });

  const tableData = engineers.map(e => [
    e.name,
    e.email,
    e.location,
    e.technicianType,
    e.level,
    e.status,
    e.joined
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['NAME', 'EMAIL', 'LOCATION', 'TYPE', 'LEVEL', 'STATUS', 'JOINED']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 7,
      cellPadding: 2
    }
  });

  // Detailed View for each engineer
  engineers.forEach((engineer, index) => {
    doc.addPage();
    
    // Header for detailed page
    doc.setFillColor(45, 212, 191);
    doc.rect(0, 0, pageWidth, 15, 'F');
    
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`ENGINEER PROFILE: ${engineer.name}`, margin, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(45, 212, 191);
    doc.text("DETAILED REGISTRATION INFORMATION", margin, 41);

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 45, pageWidth - margin, 45);
    
    let currentY = 60;
    const labelX = margin;
    const valueX = margin + 50;
    
    const drawRow = (label: string, value: any) => {
      if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(label, labelX, currentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const stringValue = typeof value === 'string' ? value : (value ? String(value) : 'N/A');
      const splitValue = doc.splitTextToSize(stringValue, pageWidth - valueX - margin);
      doc.text(splitValue, valueX, currentY);
      currentY += (splitValue.length * 5) + 5;
    };
    
    drawRow("FULL NAME:", engineer.name);
    drawRow("JOB TITLE:", engineer.specialization || 'N/A');
    drawRow("EMAIL:", engineer.email);
    drawRow("PHONE:", engineer.phone || 'N/A');
    drawRow("WHATSAPP:", engineer.whatsapp || 'N/A');
    drawRow("LOCATION:", engineer.location);
    drawRow("TECH TYPE:", engineer.technicianType);
    drawRow("SERVICE TYPE:", engineer.serviceType);
    drawRow("LEVEL:", engineer.level);
    drawRow("EXPERIENCE:", `${engineer.experience} Years`);
    drawRow("LANGUAGES:", engineer.languages);
    drawRow("STATUS:", engineer.status);
    drawRow("JOINED DATE:", engineer.joined);
    
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("PERFORMANCE:", labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Total Completed: ${engineer.totalCompleted || 0} | This Month: ${engineer.thisMonthCompleted || 0}`, valueX, currentY);
    currentY += 10;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("RATES:", labelX, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Hourly: ${engineer.hourlyRate || '$0'} | Half Day: ${engineer.halfDayRate || '$0'} | Full Day: ${engineer.fullDayRate || '$0'}`, valueX, currentY);
    currentY += 10;

    if (engineer.skills && engineer.skills.length > 0) {
      drawRow("TECHNICAL SKILLS:", engineer.skills.join(', '));
    }

    if (engineer.bio) {
      drawRow("BIO:", engineer.bio);
    }

    if (engineer.paymentDetails) {
      currentY += 5;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text("BANK ACCOUNT DETAILS:", labelX, currentY);
      currentY += 8;
      
      const p = engineer.paymentDetails;
      drawRow("  Method:", p.method);
      drawRow("  Bank Name:", p.bankName);
      drawRow("  Account Holder:", p.accountHolder);
      drawRow("  Account Number:", p.accountNumber);
      drawRow("  SWIFT/BIC:", p.swiftCode);
      if (p.routingNumber) drawRow("  Routing Number:", p.routingNumber);
    }

    if (engineer.hasCV) {
      currentY += 5;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 212, 191);
      doc.text("CURRICULUM VITAE: Verified Resume Document Available", labelX, currentY);
    }
    
    // Footer for detailed page
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Desknet Global Solutions - Engineer Report - Page ${index + 2}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  });

  doc.save(`Desknet_Engineers_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateClientListPDF = (clients: ClientListItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  drawLogo(doc, margin, 25, 12);

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 15, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.text("GLOBAL SOLUTIONS", margin + 15, 41);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("CLIENT LIST REPORT", pageWidth - margin, 38, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 45, { align: 'right' });

  const tableData = clients.map(c => [
    c.name,
    c.company,
    c.email,
    c.location,
    c.size,
    c.status,
    c.joined
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['NAME', 'COMPANY', 'EMAIL', 'LOCATION', 'SIZE', 'STATUS', 'JOINED']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 7,
      cellPadding: 2
    }
  });

  // Detailed View for each client (One per page as requested in similar context)
  clients.forEach((client, index) => {
    doc.addPage();
    
    // Header for detailed page
    doc.setFillColor(45, 212, 191);
    doc.rect(0, 0, pageWidth, 15, 'F');
    
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`CLIENT PROFILE: ${client.name}`, margin, 35);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 40, pageWidth - margin, 40);
    
    let currentY = 55;
    const labelX = margin;
    const valueX = margin + 50;
    
    const drawRow = (label: string, value: string) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(label, labelX, currentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(value || 'N/A', valueX, currentY);
      currentY += 10;
    };
    
    drawRow("FULL NAME:", client.name);
    drawRow("COMPANY:", client.company);
    drawRow("EMAIL:", client.email);
    drawRow("LOCATION:", client.location);
    drawRow("COMPANY SIZE:", client.size);
    drawRow("STATUS:", client.status);
    drawRow("JOINED DATE:", client.joined);
    if (client.phone) drawRow("PHONE:", client.phone);
    if (client.industry) drawRow("INDUSTRY:", client.industry);
    
    // Footer for detailed page
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Desknet Global Solutions - Client Report - Page ${index + 2}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  });

  doc.save(`Desknet_Clients_${new Date().toISOString().split('T')[0]}.pdf`);
};

export interface TicketReportItem {
  id: string;
  subject: string;
  clientName: string;
  clientEmail: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  description: string;
  engineerName?: string;
  engineerEmail?: string;
  engineerPhone?: string;
  quoteAmount?: string;
  quoteDescription?: string;
  updates?: {
    text: string;
    timestamp: any;
    author: string;
  }[];
}

export const generateTicketReportPDF = (tickets: TicketReportItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Header
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  drawLogo(doc, margin, 25, 12);

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 15, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.text("GLOBAL SOLUTIONS", margin + 15, 41);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("SERVICE TICKET REPORT", pageWidth - margin, 38, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 45, { align: 'right' });

  // Summary Table
  const tableData = tickets.map(ticket => [
    ticket.id.slice(0, 8).toUpperCase(),
    ticket.subject,
    ticket.clientName,
    ticket.status,
    ticket.priority,
    ticket.createdAt
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['TICKET ID', 'SUBJECT', 'CLIENT', 'STATUS', 'PRIORITY', 'CREATED']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 }
    }
  });

  // Detailed View for each ticket
  let currentY = (doc as any).lastAutoTable.finalY + 20;

  tickets.forEach((ticket, index) => {
    // Check if we need a new page for the detailed section
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`TICKET DETAILS: ${ticket.id.toUpperCase()} - ${ticket.subject}`, margin + 5, currentY + 7);
    
    currentY += 15;

    // Core Details
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text("CLIENT:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${ticket.clientName} (${ticket.clientEmail})`, margin + 40, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("STATUS / PRIORITY:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${ticket.status} / ${ticket.priority}`, margin + 40, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("CATEGORY:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(ticket.category, margin + 40, currentY);
    currentY += 10;

    // Description
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("DESCRIPTION:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(ticket.description || 'N/A', pageWidth - (margin * 2) - 10);
    doc.text(splitDesc, margin, currentY + 6);
    currentY += (splitDesc.length * 5) + 10;

    // Engineer & Quotation Info (Two Columns)
    const colWidth = (pageWidth - (margin * 2)) / 2;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("ENGINEER DETAILS:", margin, currentY);
    doc.text("QUOTATION INFO:", margin + colWidth, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Name: ${ticket.engineerName || 'Unassigned'}`, margin, currentY + 6);
    if (ticket.engineerEmail) doc.text(`Email: ${ticket.engineerEmail}`, margin, currentY + 11);
    if (ticket.engineerPhone) doc.text(`Phone: ${ticket.engineerPhone}`, margin, currentY + 16);
    
    doc.text(`Amount: ${ticket.quoteAmount || 'N/A'}`, margin + colWidth, currentY + 6);
    const splitQuoteDesc = doc.splitTextToSize(ticket.quoteDescription || 'N/A', colWidth - 10);
    doc.text(splitQuoteDesc, margin + colWidth, currentY + 11);
    
    currentY += Math.max(25, 11 + (splitQuoteDesc.length * 5)) + 10;

    // Updates / Comments
    if (ticket.updates && ticket.updates.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text("TICKET UPDATES & COMMENTS:", margin, currentY);
      currentY += 8;

      ticket.updates.forEach((update) => {
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 30;
        }
        
        const dateStr = typeof update.timestamp === 'string' ? new Date(update.timestamp).toLocaleString() : 'N/A';
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 212, 191);
        doc.text(`${update.author} - ${dateStr}`, margin, currentY);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        const splitUpdate = doc.splitTextToSize(update.text, pageWidth - (margin * 2) - 10);
        doc.text(splitUpdate, margin, currentY + 5);
        currentY += (splitUpdate.length * 5) + 10;
      });
    }

    currentY += 10;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`Desknet_Ticket_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export interface OpportunityReportItem {
  id: string;
  title: string;
  clientName: string;
  type: string;
  location: string;
  status: string;
  createdAt: string;
  description: string;
  budget?: string;
  timeline?: string;
}

export const generateOpportunityReportPDF = (opportunities: OpportunityReportItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Header
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  drawLogo(doc, margin, 25, 12);

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 15, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.text("GLOBAL SOLUTIONS", margin + 15, 41);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("OPPORTUNITIES REPORT", pageWidth - margin, 38, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 45, { align: 'right' });

  // Summary Table
  const tableData = opportunities.map(opp => [
    opp.id.slice(0, 8).toUpperCase(),
    opp.title,
    opp.clientName,
    opp.type,
    opp.status,
    opp.createdAt
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['ID', 'TITLE', 'CLIENT', 'TYPE', 'STATUS', 'CREATED']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    }
  });

  // Detailed View
  let currentY = (doc as any).lastAutoTable.finalY + 20;

  opportunities.forEach((opp) => {
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`OPPORTUNITY: ${opp.title}`, margin + 5, currentY + 7);
    
    currentY += 15;

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text("CLIENT:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(opp.clientName, margin + 40, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("TYPE / STATUS:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${opp.type} / ${opp.status}`, margin + 40, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("LOCATION:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(opp.location, margin + 40, currentY);
    currentY += 10;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("DESCRIPTION:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(opp.description || 'N/A', pageWidth - (margin * 2) - 10);
    doc.text(splitDesc, margin, currentY + 6);
    currentY += (splitDesc.length * 5) + 10;

    if (opp.budget || opp.timeline) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text("BUDGET:", margin, currentY);
      doc.text("TIMELINE:", margin + ((pageWidth - (margin * 2)) / 2), currentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(opp.budget || 'N/A', margin + 40, currentY);
      doc.text(opp.timeline || 'N/A', margin + ((pageWidth - (margin * 2)) / 2) + 40, currentY);
      currentY += 15;
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
  });

  doc.save(`Desknet_Opportunities_${new Date().toISOString().split('T')[0]}.pdf`);
};

export interface JobPostingReportItem {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  technicianType: string;
  serviceType: string;
  engineerLevel: string;
  engineersCount: string;
  salary: string;
  language: string;
  languageRequirement: string;
  createdAt: string;
  imageUrl?: string | null;
}

export const generateJobsReportPDF = (jobs: JobPostingReportItem[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Header
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  drawLogo(doc, margin, 25, 12);

  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 15, 35);
  
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.text("GLOBAL SOLUTIONS", margin + 15, 41);

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("JOB POSTINGS REPORT", pageWidth - margin, 38, { align: 'right' });

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 45, { align: 'right' });

  // Summary Table
  const tableData = jobs.map(job => [
    job.title,
    job.location,
    job.technicianType,
    job.salary,
    job.createdAt
  ]);

  autoTable(doc, {
    startY: 60,
    head: [['TITLE', 'LOCATION', 'TYPE', 'SALARY', 'POSTED']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    }
  });

  // Detailed View
  let currentY = (doc as any).lastAutoTable.finalY + 20;

  jobs.forEach((job) => {
    if (currentY > pageHeight - 100) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`JOB: ${job.title}`, margin + 5, currentY + 7);
    
    currentY += 15;

    // Details Grid
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    
    const col1 = margin;
    const col2 = margin + (pageWidth - margin * 2) / 3;
    const col3 = margin + (2 * (pageWidth - margin * 2)) / 3;

    doc.setFont('helvetica', 'bold');
    doc.text("LOCATION:", col1, currentY);
    doc.text("TYPE:", col2, currentY);
    doc.text("SALARY:", col3, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(job.location, col1, currentY + 5);
    doc.text(job.technicianType, col2, currentY + 5);
    doc.text(job.salary, col3, currentY + 5);
    
    currentY += 15;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("LANGUAGE:", col1, currentY);
    doc.text("LEVEL:", col2, currentY);
    doc.text("ENGINEERS:", col3, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${job.language} (${job.languageRequirement})`, col1, currentY + 5);
    doc.text(job.engineerLevel, col2, currentY + 5);
    doc.text(job.engineersCount, col3, currentY + 5);
    
    currentY += 15;

    // Image if exists
    if (job.imageUrl) {
      try {
        // Simple check if it's a base64 image
        if (job.imageUrl.startsWith('data:image')) {
          const imgWidth = 100;
          const imgHeight = 60;
          if (currentY + imgHeight > pageHeight - 20) {
            doc.addPage();
            currentY = 30;
          }
          
          // Extract format from data URI
          const formatMatch = job.imageUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
          const format = formatMatch ? formatMatch[1].toUpperCase() : 'JPEG';
          
          doc.addImage(job.imageUrl, format, margin, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;
        }
      } catch (e) {
        console.error("Error adding image to PDF:", e);
      }
    }

    // Description
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text("DESCRIPTION & REQUIREMENTS:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    const splitDesc = doc.splitTextToSize(job.description || 'N/A', pageWidth - (margin * 2) - 10);
    doc.text(splitDesc, margin, currentY + 6);
    currentY += (splitDesc.length * 5) + 15;

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`Desknet_Jobs_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generatePOPDF = (data: POData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // --- Background / Decorative Elements ---
  // Top Accent Bar
  doc.setFillColor(45, 212, 191); // brand-teal
  doc.rect(0, 0, pageWidth, 15, 'F');

  // --- Header Section ---
  // Logo
  drawLogo(doc, margin, 25, 15);

  // Logo / Company Name
  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("DESKNET", margin + 18, 35);
  
  // Tagline or Subtitle
  doc.setFontSize(10);
  doc.setTextColor(45, 212, 191); // brand-teal
  doc.setFont('helvetica', 'bold');
  doc.text("GLOBAL SOLUTIONS", margin + 18, 41);

  // Company Info (Left Aligned under Logo)
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY_INFO.address, margin, 50);
  doc.text(`Phone: ${COMPANY_INFO.phone}  |  Email: ${COMPANY_INFO.email}`, margin, 55);

  // Title "PURCHASE ORDER" (Right Aligned)
  doc.setFontSize(32);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFont('helvetica', 'bold');
  doc.text("PURCHASE ORDER", pageWidth - margin, 40, { align: 'right' });

  // Metadata Box (Right Aligned)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85); // slate-700
  
  const metaY = 50;
  doc.text("DATE:", pageWidth - 70, metaY);
  doc.text("PO #:", pageWidth - 70, metaY + 6);
  doc.text("QUOTE REF:", pageWidth - 70, metaY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(data.date, pageWidth - margin, metaY, { align: 'right' });
  doc.text(data.poNumber, pageWidth - margin, metaY + 6, { align: 'right' });
  doc.text(data.quoteRef, pageWidth - margin, metaY + 12, { align: 'right' });

  // --- Client & Requester Info Section ---
  const infoY = 85;
  
  // Decorative line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.line(margin, infoY - 10, pageWidth - margin, infoY - 10);

  // To (Client)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, infoY, (pageWidth / 2) - margin - 5, 35, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text("BILL TO (CLIENT):", margin + 5, infoY + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text(data.client.name, margin + 5, infoY + 16);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const splitAddress = doc.splitTextToSize(data.client.address, (pageWidth / 2) - margin - 15);
  doc.text(splitAddress, margin + 5, infoY + 22);

  // Requester
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(pageWidth / 2 + 5, infoY, (pageWidth / 2) - margin - 5, 35, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text("REQUESTER INFO:", pageWidth / 2 + 10, infoY + 8);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text(data.requester.company, pageWidth / 2 + 10, infoY + 16);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Contact: ${data.requester.contact}`, pageWidth / 2 + 10, infoY + 22);
  doc.text(`Phone: ${data.requester.phone}`, pageWidth / 2 + 10, infoY + 27);

  // --- Items Table ---
  const tableData = data.items.map((item, index) => [
    index + 1,
    item.description,
    item.qty,
    `${data.summary.currency === 'EUR' ? '€' : '$'}${item.unitPrice.toLocaleString()}`,
    `${data.summary.currency === 'EUR' ? '€' : '$'}${item.total.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: infoY + 45,
    head: [['#', 'DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42], // slate-900
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 4
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 15 },
      1: { cellWidth: 'auto' },
      2: { halign: 'center', cellWidth: 20 },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'right', cellWidth: 35 }
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [241, 245, 249], // slate-100
      lineWidth: 0.1
    },
    alternateRowStyles: {
      fillColor: [252, 253, 254]
    }
  });

  // --- Summary Section ---
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  const summaryWidth = 70;
  const summaryX = pageWidth - margin - summaryWidth;

  // Special Instructions (Left Column)
  if (data.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text("NOTES / SPECIAL INSTRUCTIONS:", margin, finalY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105); // slate-600
    
    const splitNotes = doc.splitTextToSize(data.notes, summaryX - margin - 10);
    doc.text(splitNotes, margin, finalY + 7);
  }

  // Pricing Summary (Right Column)
  const rowHeight = 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);

  doc.text("SUBTOTAL:", summaryX, finalY);
  doc.text(`${data.summary.currency === 'EUR' ? '€' : '$'}${data.summary.subtotal.toLocaleString()}`, pageWidth - margin, finalY, { align: 'right' });

  doc.text("VAT (0%):", summaryX, finalY + rowHeight);
  doc.text(`${data.summary.currency === 'EUR' ? '€' : '$'}${data.summary.vat.toLocaleString()}`, pageWidth - margin, finalY + rowHeight, { align: 'right' });

  doc.text("SHIPPING:", summaryX, finalY + (rowHeight * 2));
  doc.text(`${data.summary.currency === 'EUR' ? '€' : '$'}${data.summary.shipping.toLocaleString()}`, pageWidth - margin, finalY + (rowHeight * 2), { align: 'right' });

  // Total Amount Box
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(summaryX - 5, finalY + (rowHeight * 3), summaryWidth + 5, 12, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL:", summaryX, finalY + (rowHeight * 3) + 8);
  doc.text(`${data.summary.currency === 'EUR' ? '€' : '$'}${data.summary.total.toLocaleString()}`, pageWidth - margin, finalY + (rowHeight * 3) + 8, { align: 'right' });

  // --- Footer ---
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Thank you for choosing Desknet Global Solutions.", pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text("This is a computer-generated document. No signature is required.", pageWidth / 2, pageHeight - 15, { align: 'center' });

  // Save the PDF
  doc.save(`PO_${data.poNumber}.pdf`);
};
