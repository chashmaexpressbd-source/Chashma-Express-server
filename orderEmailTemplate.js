const orderEmailTemplate = order => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background:#f0f2f5;font-family:'Segoe UI',Arial,sans-serif;">
    
    <!-- Main Container -->
    <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
      
      <!-- Header with Gradient -->
      <div style="background:linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);padding:35px 30px;text-align:center;position:relative;">
        <!-- Decorative Circle -->
        <div style="position:absolute;top:-50px;right:-50px;width:150px;height:150px;background:rgba(255,255,255,0.05);border-radius:50%;"></div>
        <div style="position:absolute;bottom:-60px;left:-40px;width:120px;height:120px;background:rgba(255,255,255,0.05);border-radius:50%;"></div>
        
        <div style="font-size:48px;margin-bottom:8px;">🛒</div>
        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">New Order Received</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">Order #${order._id ? order._id.toString().slice(-6) : 'NEW'}</p>
      </div>
      
      <!-- Order Summary Badge -->
      <div style="background:#fafafa;padding:20px 30px;border-bottom:1px solid #f0f0f0;text-align:center;">
        <span style="display:inline-block;background:#fef3c7;color:#92400e;padding:6px 18px;border-radius:50px;font-size:13px;font-weight:600;">
          ⏳ ${order.status.toUpperCase()}
        </span>
        <span style="display:inline-block;margin-left:10px;background:#e0f2fe;color:#0369a1;padding:6px 18px;border-radius:50px;font-size:13px;font-weight:600;">
          📅 ${new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
      
      <!-- Body Content -->
      <div style="padding:30px;">
        
        <!-- Product Card -->
        <div style="background:#fafafa;border-radius:16px;padding:20px;margin-bottom:25px;border:1px solid #f0f0f0;">
          <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
            <div style="flex-shrink:0;">
              <img src="${order.productImage}" alt="${order.productName}"
                style="width:100px;height:100px;object-fit:cover;border-radius:12px;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
            </div>
            <div style="flex:1;min-width:150px;">
              <h3 style="margin:0 0 6px;font-size:17px;font-weight:600;color:#1a1a1a;">${order.productName}</h3>
              <div style="display:flex;gap:15px;flex-wrap:wrap;font-size:14px;color:#6b7280;">
                <span>🔢 Qty: <strong style="color:#1a1a1a;">${order.quantity}</strong></span>
                <span>💰 Price: <strong style="color:#dc2626;">৳${order.price}</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Total Amount -->
        <div style="background:linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);border-radius:16px;padding:18px 25px;margin-bottom:25px;display:flex;justify-content:space-between;align-items:center;border:1px solid #fecaca;">
          <span style="font-size:16px;font-weight:600;color:#991b1b;">💵 Total Amount</span>
          <span style="font-size:28px;font-weight:800;color:#dc2626;">৳${order.price * order.quantity}</span>
        </div>
        
        <!-- Customer Information -->
        <div style="margin-bottom:20px;">
          <h4 style="margin:0 0 15px;font-size:15px;color:#4b5563;letter-spacing:0.5px;text-transform:uppercase;">👤 Customer Details</h4>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div style="background:#f9fafb;border-radius:12px;padding:14px 18px;border:1px solid #f3f4f6;">
              <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Name</div>
              <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-top:3px;">${order.userName}</div>
            </div>
            <div style="background:#f9fafb;border-radius:12px;padding:14px 18px;border:1px solid #f3f4f6;">
              <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Phone</div>
              <div style="font-size:15px;font-weight:600;color:#1a1a1a;margin-top:3px;">${order.userPhone}</div>
            </div>
          </div>
          
          <div style="background:#f9fafb;border-radius:12px;padding:14px 18px;border:1px solid #f3f4f6;margin-top:12px;">
            <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">📍 Delivery Address</div>
            <div style="font-size:15px;font-weight:500;color:#1a1a1a;margin-top:3px;">${order.userAddress}</div>
          </div>
        </div>
        
        <!-- Additional Info -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:#f9fafb;border-radius:12px;padding:12px 16px;border:1px solid #f3f4f6;">
            <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">🆔 Product ID</div>
            <div style="font-size:13px;font-weight:500;color:#1a1a1a;margin-top:3px;">${order.productId}</div>
          </div>
          <div style="background:#f9fafb;border-radius:12px;padding:12px 16px;border:1px solid #f3f4f6;">
            <div style="font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">🕒 Order Time</div>
            <div style="font-size:13px;font-weight:500;color:#1a1a1a;margin-top:3px;">${new Date(order.createdAt).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
        
      </div>
      
      <!-- Footer -->
      <div style="background:#fafafa;padding:22px 30px;text-align:center;border-top:2px solid #f0f0f0;">
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1a1a1a;">Chashma Express BD</p>
        <p style="margin:0;color:#9ca3af;font-size:12px;">This is an automatic order notification • Please verify and process</p>
        <div style="margin-top:12px;display:flex;justify-content:center;gap:12px;">
          <span style="display:inline-block;width:6px;height:6px;background:#dc2626;border-radius:50%;"></span>
          <span style="display:inline-block;width:6px;height:6px;background:#dc2626;border-radius:50%;opacity:0.6;"></span>
          <span style="display:inline-block;width:6px;height:6px;background:#dc2626;border-radius:50%;opacity:0.3;"></span>
        </div>
      </div>
      
    </div>
    
    <!-- Responsive Fix -->
    <div style="max-width:600px;margin:0 auto;text-align:center;padding:10px;color:#9ca3af;font-size:11px;">
      If you're having trouble viewing this email, please contact support.
    </div>
    
  </body>
  </html>
`;

module.exports = orderEmailTemplate;
