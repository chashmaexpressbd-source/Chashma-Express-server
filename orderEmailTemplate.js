const orderEmailTemplate = order => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order</title>
</head>
<body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,Helvetica,sans-serif;">
  
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-collapse:collapse;">
    
    <!-- Header -->
    <tr>
      <td style="background:#dc2626;padding:30px 30px 25px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">New Order Received</h1>
      </td>
    </tr>
    
    <!-- Body -->
    <tr>
      <td style="padding:30px 30px 20px;">
        
        <!-- Greeting -->
        <p style="margin:0 0 20px;color:#333;font-size:15px;line-height:1.6;">
          You have received a new order. Details are below:
        </p>
        
        <!-- Order Info -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eaeaea;font-size:14px;color:#555;width:30%;">Order ID</td>
            <td style="padding:10px 0;border-bottom:1px solid #eaeaea;font-size:14px;color:#333;font-weight:600;">#${order._id ? order._id.toString().slice(-6) : 'NEW'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eaeaea;font-size:14px;color:#555;">Status</td>
            <td style="padding:10px 0;border-bottom:1px solid #eaeaea;font-size:14px;color:#333;">
              <span style="background:#fef3c7;color:#92400e;padding:3px 12px;border-radius:4px;font-size:12px;font-weight:600;">${order.status.toUpperCase()}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eaeaea;font-size:14px;color:#555;">Date</td>
            <td style="padding:10px 0;border-bottom:1px solid #eaeaea;font-size:14px;color:#333;">${new Date(order.createdAt).toLocaleString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
          </tr>
        </table>
        
        <!-- Product -->
        <h3 style="margin:20px 0 12px;font-size:15px;color:#333;">Product Details</h3>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f8fafc;border-radius:6px;overflow:hidden;">
          <tr>
            <td style="padding:15px;border-bottom:1px solid #eaeaea;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width:80px;vertical-align:middle;">
                    <img src="${order.productImage}" alt="${order.productName}" style="width:70px;height:70px;object-fit:cover;border-radius:6px;display:block;">
                  </td>
                  <td style="vertical-align:middle;padding-left:15px;">
                    <div style="font-weight:600;color:#333;font-size:15px;margin-bottom:4px;">${order.productName}</div>
                    <div style="font-size:13px;color:#666;">
                      Quantity: ${order.quantity} &nbsp;|&nbsp; Price: ৳${order.price}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 15px;background:#f1f5f9;font-weight:600;font-size:16px;color:#dc2626;text-align:right;">
              Total: ৳${order.price * order.quantity}
            </td>
          </tr>
        </table>
        
        <!-- Customer -->
        <h3 style="margin:25px 0 12px;font-size:15px;color:#333;">Customer Information</h3>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f8fafc;border-radius:6px;overflow:hidden;">
          <tr>
            <td style="padding:12px 15px;border-bottom:1px solid #eaeaea;font-size:14px;color:#555;width:30%;">Name</td>
            <td style="padding:12px 15px;border-bottom:1px solid #eaeaea;font-size:14px;color:#333;font-weight:500;">${order.userName}</td>
          </tr>
          <tr>
            <td style="padding:12px 15px;border-bottom:1px solid #eaeaea;font-size:14px;color:#555;">Phone</td>
            <td style="padding:12px 15px;border-bottom:1px solid #eaeaea;font-size:14px;color:#333;font-weight:500;">${order.userPhone}</td>
          </tr>
          <tr>
            <td style="padding:12px 15px;font-size:14px;color:#555;">Address</td>
            <td style="padding:12px 15px;font-size:14px;color:#333;font-weight:500;">${order.userAddress}</td>
          </tr>
        </table>
        
        <!-- Product ID -->
        <div style="margin-top:20px;padding:12px 15px;background:#f8fafc;border-radius:6px;font-size:13px;color:#666;">
          <strong>Product ID:</strong> ${order.productId}
        </div>
        
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;padding:20px 30px;text-align:center;border-top:2px solid #eaeaea;">
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#333;">Chashma Express BD</p>
        <p style="margin:0;font-size:12px;color:#888;">This is an automated notification. Please verify and process the order.</p>
      </td>
    </tr>
    
  </table>
  
</body>
</html>
`;

module.exports = orderEmailTemplate;
