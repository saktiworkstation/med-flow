const fs = require('fs');
let content = fs.readFileSync('supabase/seed.sql', 'utf-8');
let lines = content.split('\n');
let inInvoices = false;
let result = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (line.includes('INSERT INTO invoices (')) {
    inInvoices = true;
    // Fix column list
    line = line.replace(
      'invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, payment_method, paid_at, notes, created_at, updated_at)',
      'invoice_number, invoice_date, due_date, status, subtotal, tax_amount, discount_amount, total_amount, paid_amount, payment_method, notes, created_at, updated_at)'
    );
    result.push(line);
    continue;
  }

  if (inInvoices && (line.startsWith('-- Invoice Items') || line.startsWith('INSERT INTO invoice_items'))) {
    inInvoices = false;
  }

  if (inInvoices && line.trim().startsWith("('f0")) {
    // Find status
    const statusMatch = line.match(/'(paid|pending|overdue|draft|sent|cancelled|partially_paid)'/);
    if (!statusMatch) { result.push(line); continue; }
    const status = statusMatch[1];
    const afterIdx = statusMatch.index + statusMatch[0].length;
    const before = line.substring(0, afterIdx);
    const after = line.substring(afterIdx);

    // after: , subtotal, tax, total, payment_method, paid_at, notes, created, updated)[,;]
    const re = /,\s*(\d+),\s*(\d+),\s*(\d+),\s*('[^']*'|NULL),\s*('[^']*'|NULL),\s*('[^']*'|NULL),\s*('[^']*'),\s*('[^']*')\)([,;]?)/;
    const m = after.match(re);
    if (m) {
      const subtotal = m[1];
      const tax = m[2];
      const total = m[3];
      const payMethod = m[4];
      // m[5] is paid_at - skip it
      const notes = m[6];
      const created = m[7];
      const updated = m[8];
      const ending = m[9];
      const paidAmount = status === 'paid' ? total : '0';
      line = before + ', ' + subtotal + ', ' + tax + ', 0, ' + total + ', ' + paidAmount + ', ' + payMethod + ', ' + notes + ', ' + created + ', ' + updated + ')' + ending;
    }
  }

  // Fix invoice_items: add category column
  if (line.includes('INSERT INTO invoice_items (id, invoice_id, description, quantity,')) {
    line = line.replace(
      'INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total_price, created_at)',
      "INSERT INTO invoice_items (id, invoice_id, description, category, quantity, unit_price, total_price, created_at)"
    );
  }

  // Add category to invoice_item rows
  if (line.trim().startsWith("('f1")) {
    // Add 'other' category after description
    // Pattern: ('id', 'invoice_id', 'description', quantity, ...
    const itemRe = /^(\s*\('f1[^']*',\s*'f0[^']*',\s*'[^']*')(,\s*\d+)/;
    const im = line.match(itemRe);
    if (im) {
      const desc = im[1].toLowerCase();
      let cat = "'other'";
      if (desc.includes('konsultasi')) cat = "'consultation'";
      else if (desc.includes('obat') || desc.includes('tablet') || desc.includes('mg') || desc.includes('ml') || desc.includes('sirup') || desc.includes('cream') || desc.includes('tetes') || desc.includes('inhaler') || desc.includes('kapsul') || desc.includes('salep')) cat = "'medication'";
      else if (desc.includes('tindakan') || desc.includes('jahit') || desc.includes('nebul') || desc.includes('ekg') || desc.includes('lab')) cat = "'procedure'";
      else if (desc.includes('admin')) cat = "'administration'";
      line = im[1] + ', ' + cat + im[2] + line.substring(im[0].length);
    }
  }

  result.push(line);
}

fs.writeFileSync('supabase/seed.sql', result.join('\n'), 'utf-8');
console.log('Done - fixed invoices and invoice_items');
