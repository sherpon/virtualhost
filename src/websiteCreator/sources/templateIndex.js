const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <%- include(\`header\`, {}); %>
    <main class="page-container">
      Your welcome to <%= domain %>!!!
    </main>
    <%- include(\`footer\`, {}); %>
  </body>
</html>
`;

module.exports = html;