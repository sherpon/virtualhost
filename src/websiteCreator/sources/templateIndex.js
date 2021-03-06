const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= pageConfig.title %></title>
    <meta name="Keywords" content="<%= pageConfig.keywords %>">
    <meta name="Description" content="<%= pageConfig.description %>">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="theme-color" content="<%= pageConfig.themeColor %>">
    <link rel="shortcut icon" href="<%= websiteConfig.favicon %>">
    <%- pageConfig.meta %>
    <style id="style-template">
      * { 
        box-sizing: border-box; 
      }
      body {
        margin: 0px;
      }
    </style>
    <style id="style-page">
      <%- pageConfig.style %>
    </style>
    <script id="script-template">
    </script>
    <script id="script-page">
      <%- pageConfig.script %>
    </script>
  </head>
  <body>
    <%- include('../pages/home', {domain}); %>
  </body>
</html>
`;

module.exports = html;

//<%- include(\`header\`, {}); %>
//<%- include('../pages/home', {domain}); %>
//<%- include(\`footer\`, {}); %>