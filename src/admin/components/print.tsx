export const printOrder = (order: any) => {
  const win = window.open("", "", "width=320,height=600");

  if (!win) return;

  win.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Invoice</title>
  <style>
    @media print {
      body {
        width: 80mm;
        margin: 0;
      }
    }

    body {
      font-family: monospace;
      font-size: 12px;
      padding: 8px;
    }

    .center {
      text-align: center;
    }

    .bold {
      font-weight: bold;
    }

    .line {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }

    .item {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }

    .total {
      font-size: 14px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>

<body>
  <div class="center bold">
    Mini Coffee Shop
  </div>
  <div class="center">
    09-95xxxxxxx<br/>
    Yangon
  </div>

  <div class="line"></div>

  <div>
    Customer : ${order.customer_name ?? "Unknown"}<br/>
    Table    : ${order.table_number ?? "-"}<br/>
    Date     : ${new Date().toLocaleString()}
  </div>

  <div class="line"></div>

  ${
    order.items
      ?.map(
        (i: any) => `
          <div class="item">
            <span>${i.name}</span>
            <span>x${i.quantity}</span>
          </div>
        `
      )
      .join("")
  }

  <div class="line"></div>

  <div class="total">
    <span>TOTAL</span>
    <span>${order.total} Ks</span>
  </div>

  <div class="line"></div>

  <div class="center">
    Thank you for your order<br/>
    Please come again
  </div>

  <script>
    window.onload = function () {
      window.print();
      window.close();
    };
  </script>
</body>
</html>
  `);

  win.document.close();
};
