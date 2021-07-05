# Saleor-Zoho interconnection service

This service can be used to synchronize a Saleor Webshop system with Zoho Inventory using webhooks from both sides.
New orders and customers get synced to Zoho. Zoho storage units get pushed to Saleor in order to make sure, that no overselling is happening.

# Requirements

- A valid Zoho Application (https://api-console.zoho.eu/)
- A valid Saleor App (was called ServiceAccount before)
- Saleor >= v2.10

# Local development

You can tunnel webhooks to your local machine during development

# Triggers

We use AWS Lambda to trigger certain functions. Syncing Promo-Codes states from Saleor to Mailchimp can happen only via cron triggers. The corresponding serverless config is located in the `triggers` folder.
