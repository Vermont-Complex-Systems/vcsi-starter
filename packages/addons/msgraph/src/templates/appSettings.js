// https://learn.microsoft.com/en-us/graph/tutorials/javascript?tabs=aad
// Configuration for Microsoft Graph API

export const settings = {
  clientId: process.env.clientId,
  tenantId: process.env.tenantId,
  clientSecret: process.env.clientSecret,
  // SharePoint site ID - get from Graph Explorer or Azure Portal
  siteId: '__SITE_ID__',
  // Default scopes for client credentials flow
  scopes: ['https://graph.microsoft.com/.default'],
};

export default settings;
