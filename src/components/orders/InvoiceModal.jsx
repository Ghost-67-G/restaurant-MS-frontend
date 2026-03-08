import { X, Printer, Download } from 'lucide-react';
import { Button } from '../ui/button';

export default function InvoiceModal({ invoice, isOpen, onClose }) {
  if (!isOpen || !invoice) return null;

  const snapshot = invoice.snapshot;

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getItemLineTotal = (item) => {
    const modifiersTotal = (item.selectedModifiers || []).reduce(
      (sum, modifier) => sum + Number(modifier.price || 0),
      0
    );
    return (Number(item.price || 0) + modifiersTotal) * item.quantity;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1e293b;
              background: white;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
            }
            
            /* Header */
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #ea580c;
            }
            
            .company-info h1 {
              font-size: 32px;
              font-weight: bold;
              color: #ea580c;
              margin-bottom: 5px;
            }
            
            .company-info p {
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
            }
            
            .invoice-number-box {
              text-align: right;
              background: #fff7ed;
              padding: 12px 20px;
              border-radius: 6px;
              border: 1px solid #fed7aa;
            }
            
            .invoice-number-box .label {
              font-size: 10px;
              font-weight: bold;
              color: #c2410c;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .invoice-number-box .number {
              font-size: 20px;
              font-weight: bold;
              color: #ea580c;
              margin-top: 2px;
            }
            
            /* Info Grid */
            .info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .info-item .label {
              font-size: 10px;
              font-weight: bold;
              color: #64748b;
              text-transform: uppercase;
              margin-bottom: 6px;
              letter-spacing: 0.5px;
            }
            
            .info-item .value {
              font-size: 13px;
              color: #1e293b;
              font-weight: 500;
            }
            
            /* Items Table */
            .items-table {
              width: 100%;
              margin: 30px 0;
              border-collapse: collapse;
            }
            
            .items-table thead tr {
              background: #f1f5f9;
            }
            
            .items-table th {
              padding: 12px;
              text-align: left;
              font-size: 11px;
              font-weight: bold;
              color: #334155;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 2px solid #cbd5e1;
            }
            
            .items-table th.text-center {
              text-align: center;
            }
            
            .items-table th.text-right {
              text-align: right;
            }
            
            .items-table tbody tr {
              border-bottom: 1px solid #e2e8f0;
            }
            
            .items-table td {
              padding: 12px;
              font-size: 13px;
            }
            
            .items-table td.text-center {
              text-align: center;
              font-weight: 600;
            }
            
            .items-table td.text-right {
              text-align: right;
            }
            
            .items-table td.amount {
              font-weight: bold;
              color: #1e293b;
            }
            
            /* Totals */
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin: 30px 0;
            }
            
            .totals-box {
              width: 350px;
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 13px;
            }
            
            .total-row.subtotal {
              color: #64748b;
            }
            
            .total-row.discount {
              color: #16a34a;
            }
            
            .total-row.tax,
            .total-row.delivery {
              color: #64748b;
            }
            
            .total-row.grand-total {
              margin-top: 10px;
              padding-top: 12px;
              border-top: 2px solid #cbd5e1;
              font-size: 16px;
              font-weight: bold;
            }
            
            .total-row.grand-total .amount {
              color: #ea580c;
              font-size: 22px;
            }
            
            .total-row.refunded {
              color: #dc2626;
              margin-top: 10px;
              padding-top: 10px;
              border-top: 1px solid #e2e8f0;
            }
            
            .total-row.net-amount {
              background: #fff7ed;
              margin: 10px -20px 0;
              padding: 12px 20px;
              border-radius: 0 0 8px 8px;
              font-size: 16px;
              font-weight: bold;
            }
            
            .total-row.net-amount .amount {
              color: #ea580c;
              font-size: 22px;
            }
            
            /* Footer */
            .invoice-footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
            }
            
            .invoice-footer .thank-you {
              font-size: 14px;
              font-weight: 600;
              color: #334155;
              margin-bottom: 8px;
            }
            
            .invoice-footer .note {
              font-size: 11px;
              color: #64748b;
            }
            
            @media print {
              body {
                padding: 20px;
              }
              
              .invoice-container {
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header -->
            <div class="invoice-header">
              <div class="company-info">
                <h1>INVOICE</h1>
                <p>Restaurant Management System</p>
              </div>
              <div class="invoice-number-box">
                <div class="label">Invoice Number</div>
                <div class="number">${invoice.invoiceNumber}</div>
              </div>
            </div>
            
            <!-- Info Grid Row 1 -->
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Order Number</div>
                <div class="value">${snapshot.orderNumber}</div>
              </div>
              <div class="info-item">
                <div class="label">Order Date</div>
                <div class="value">${formatDateShort(snapshot.createdAt)}</div>
              </div>
              <div class="info-item">
                <div class="label">Invoice Date</div>
                <div class="value">${formatDateShort(invoice.createdAt)}</div>
              </div>
            </div>
            
            <!-- Info Grid Row 2 -->
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Order Type</div>
                <div class="value" style="text-transform: capitalize;">${snapshot.orderType}</div>
              </div>
              ${snapshot.tableNumber ? `
                <div class="info-item">
                  <div class="label">Table Number</div>
                  <div class="value">${snapshot.tableNumber}</div>
                </div>
              ` : '<div></div>'}
              ${snapshot.createdBy ? `
                <div class="info-item">
                  <div class="label">Served By</div>
                  <div class="value">${snapshot.createdBy.name}</div>
                </div>
              ` : '<div></div>'}
            </div>
            
            <!-- Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th class="text-center" style="width: 80px;">Quantity</th>
                  <th class="text-right" style="width: 100px;">Price</th>
                  <th class="text-right" style="width: 120px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${snapshot.items.map(item => {
                  const lineTotal = getItemLineTotal(item);
                  const extrasText = (item.selectedModifiers || []).map((m) => `${m.name} (+$${Number(m.price || 0).toFixed(2)})`).join(', ');
                  return `
                  <tr>
                    <td>
                      ${item.name}
                      ${extrasText ? `<div style="font-size:11px;color:#64748b;margin-top:4px;">Extras: ${extrasText}</div>` : ''}
                      ${item.itemNote ? `<div style="font-size:11px;color:#64748b;margin-top:2px;">Note: ${item.itemNote}</div>` : ''}
                    </td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">$${Number(item.price).toFixed(2)}</td>
                    <td class="text-right amount">$${lineTotal.toFixed(2)}</td>
                  </tr>
                `;
                }).join('')}
              </tbody>
            </table>

            ${snapshot.notes ? `
              <div style="margin-top:20px;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;">
                <div style="font-size:11px;font-weight:700;color:#475569;text-transform:uppercase;margin-bottom:6px;">Order Note</div>
                <div style="font-size:13px;color:#1e293b;">${snapshot.notes}</div>
              </div>
            ` : ''}
            
            <!-- Totals -->
            <div class="totals-section">
              <div class="totals-box">
                <div class="total-row subtotal">
                  <span>Subtotal</span>
                  <span style="font-weight: 600; color: #1e293b;">$${Number(snapshot.subtotal).toFixed(2)}</span>
                </div>
                
                ${snapshot.discountAmount > 0 ? `
                  <div class="total-row discount">
                    <span>
                      Discount
                      ${snapshot.discountType && snapshot.discountValue ? `
                        <span style="font-size: 11px;">
                          (${snapshot.discountType === 'PERCENT' ? `${snapshot.discountValue}%` : `$${Number(snapshot.discountValue).toFixed(2)}`})
                        </span>
                      ` : ''}
                    </span>
                    <span style="font-weight: 600;">-$${Number(snapshot.discountAmount).toFixed(2)}</span>
                  </div>
                ` : ''}
                
                ${snapshot.taxAmount > 0 ? `
                  <div class="total-row tax">
                    <span>
                      ${snapshot.taxName || 'Tax'}
                      ${snapshot.taxPercentage ? `<span style="font-size: 11px;">(${snapshot.taxPercentage}%)</span>` : ''}
                    </span>
                    <span style="font-weight: 600; color: #1e293b;">$${Number(snapshot.taxAmount).toFixed(2)}</span>
                  </div>
                ` : ''}
                
                ${snapshot.deliveryFee > 0 ? `
                  <div class="total-row delivery">
                    <span>Delivery Fee</span>
                    <span style="font-weight: 600; color: #1e293b;">$${Number(snapshot.deliveryFee).toFixed(2)}</span>
                  </div>
                ` : ''}
                
                <div class="total-row grand-total">
                  <span>TOTAL</span>
                  <span class="amount">$${Number(snapshot.totalAmount).toFixed(2)}</span>
                </div>
                
                ${snapshot.refundedAmount > 0 ? `
                  <div class="total-row refunded">
                    <span>Refunded</span>
                    <span style="font-weight: 600;">-$${Number(snapshot.refundedAmount).toFixed(2)}</span>
                  </div>
                  <div class="total-row net-amount">
                    <span>NET AMOUNT</span>
                    <span class="amount">$${(snapshot.totalAmount - snapshot.refundedAmount).toFixed(2)}</span>
                  </div>
                ` : ''}
              </div>
            </div>
            
            <!-- Footer -->
            <div class="invoice-footer">
              <p class="thank-you">Thank you for your business!</p>
              <p class="note">For any queries, please contact our support team.</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            };
            
            window.onafterprint = function() {
              window.close();
            };
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                Invoice {invoice.invoiceNumber}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  size="sm"
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Invoice Preview */}
            <div className="p-8 bg-slate-50">
              <div className="bg-white shadow-sm" id="invoice-content">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-orange-600">
                    <div>
                      <h1 className="text-2xl font-bold text-orange-600 mb-1">INVOICE</h1>
                      <p className="text-slate-600 text-sm font-medium">Restaurant Management System</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block bg-orange-50 px-4 py-2 rounded">
                        <p className="text-xs text-orange-700 font-semibold uppercase">Invoice No.</p>
                        <p className="text-lg font-bold text-orange-600">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Order Number</p>
                      <p className="text-sm font-semibold text-slate-900">{snapshot.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Order Date</p>
                      <p className="text-sm text-slate-900">{formatDateShort(snapshot.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Invoice Date</p>
                      <p className="text-sm text-slate-900">{formatDateShort(invoice.createdAt)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8 pb-6 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Order Type</p>
                      <p className="text-sm text-slate-900 capitalize">{snapshot.orderType}</p>
                    </div>
                    {snapshot.tableNumber && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Table</p>
                        <p className="text-sm text-slate-900">{snapshot.tableNumber}</p>
                      </div>
                    )}
                    {snapshot.createdBy && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Served By</p>
                        <p className="text-sm text-slate-900">{snapshot.createdBy.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Items Table */}
                  <div className="mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="text-left py-3 px-4 text-xs font-bold text-slate-700 uppercase">Item</th>
                          <th className="text-center py-3 px-4 text-xs font-bold text-slate-700 uppercase w-20">Qty</th>
                          <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase w-24">Price</th>
                          <th className="text-right py-3 px-4 text-xs font-bold text-slate-700 uppercase w-28">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {snapshot.items.map((item, index) => (
                          <tr key={index}>
                            <td className="py-3 px-4 text-sm text-slate-900">
                              <p>{item.name}</p>
                              {item.selectedModifiers?.length > 0 && (
                                <p className="text-xs text-slate-500 mt-1">
                                  Extras: {item.selectedModifiers.map((modifier) => `${modifier.name} (+$${Number(modifier.price || 0).toFixed(2)})`).join(', ')}
                                </p>
                              )}
                              {item.itemNote && (
                                <p className="text-xs text-slate-500 mt-1">Note: {item.itemNote}</p>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-700 text-center font-medium">{item.quantity}</td>
                            <td className="py-3 px-4 text-sm text-slate-600 text-right">${Number(item.price).toFixed(2)}</td>
                            <td className="py-3 px-4 text-sm text-slate-900 text-right font-semibold">
                              ${getItemLineTotal(item).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {snapshot.notes && (
                    <div className="mb-8 p-3 bg-slate-100 border border-slate-200 rounded">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Order Note</p>
                      <p className="text-sm text-slate-800">{snapshot.notes}</p>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-80">
                      <div className="bg-slate-50 p-4 rounded space-y-2.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Subtotal</span>
                          <span className="text-slate-900 font-semibold">
                            ${Number(snapshot.subtotal).toFixed(2)}
                          </span>
                        </div>
                        
                        {snapshot.discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-700">
                              Discount{' '}
                              {snapshot.discountType && snapshot.discountValue && (
                                <span className="text-xs">
                                  ({snapshot.discountType === 'PERCENT' 
                                    ? `${snapshot.discountValue}%` 
                                    : `$${Number(snapshot.discountValue).toFixed(2)}`})
                                </span>
                              )}
                            </span>
                            <span className="text-green-700 font-semibold">
                              -${Number(snapshot.discountAmount).toFixed(2)}
                            </span>
                          </div>
                        )}

                        {snapshot.taxAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              {snapshot.taxName || 'Tax'}{' '}
                              {snapshot.taxPercentage && (
                                <span className="text-xs">({snapshot.taxPercentage}%)</span>
                              )}
                            </span>
                            <span className="text-slate-900 font-semibold">
                              ${Number(snapshot.taxAmount).toFixed(2)}
                            </span>
                          </div>
                        )}

                        {snapshot.deliveryFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Delivery Fee</span>
                            <span className="text-slate-900 font-semibold">
                              ${Number(snapshot.deliveryFee).toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between text-base font-bold border-t-2 border-slate-300 pt-3 mt-2">
                          <span className="text-slate-900">TOTAL</span>
                          <span className="text-orange-600 text-xl">
                            ${Number(snapshot.totalAmount).toFixed(2)}
                          </span>
                        </div>

                        {snapshot.refundedAmount > 0 && (
                          <>
                            <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                              <span className="text-red-600">Refunded</span>
                              <span className="text-red-600 font-semibold">
                                -${Number(snapshot.refundedAmount).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-base font-bold bg-orange-50 -mx-4 px-4 py-2 rounded">
                              <span className="text-slate-900">NET AMOUNT</span>
                              <span className="text-orange-600 text-xl">
                                ${(snapshot.totalAmount - snapshot.refundedAmount).toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-6 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-1">Thank you for your business!</p>
                    <p className="text-xs text-slate-500">
                      For any queries, please contact our support team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
