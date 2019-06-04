const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <%- include(\`header\`, {}); %>
    <%- include(\`../pages/\${pageName}\`, {domain, pageName}); %>
    <%- include(\`footer\`, {}); %>
  </body>
</html>
`;

module.exports = html;