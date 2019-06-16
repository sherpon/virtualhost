const html = `
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <%- include(\`header\`, {}); %>
    <%- include(\`../pages/\${pageUrl}\`, {domain, pageUrl}); %>
    <%- include(\`footer\`, {}); %>
  </body>
</html>
`;

module.exports = html;