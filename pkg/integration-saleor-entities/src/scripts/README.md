# Saleor Integration Maintenance Scripts

This directory contains utility scripts for maintaining and cleaning up data in Saleor. These scripts help ensure data consistency between your local database and the Saleor platform.

## Available Scripts

Currently, the following maintenance scripts are available:

1. **Media Cleanup** (`media-cleanup.ts`): Identifies and removes duplicate media items in Saleor products.
2. **Variant Description Cleanup** (`variant-description-cleanup.ts`): Resets variant website descriptions in Saleor that are no longer present in the local database.

## General Usage

All scripts follow a similar pattern for execution:

```bash
npx ts-node -r tsconfig-paths/register src/scripts/<script-name>.ts <installedSaleorAppId> [additional options]
```

### Common Parameters

-   `installedSaleorAppId` (required): The ID of the installed Saleor app to connect to.

## Media Cleanup Script

The media cleanup script identifies and removes duplicate media items from Saleor products. It uses image hashing to detect duplicates and intelligently handles variant-specific media.

### Usage

```bash
npx ts-node -r tsconfig-paths/register src/scripts/media-cleanup.ts <installedSaleorAppId> [productId]
```

### Parameters

-   `installedSaleorAppId` (required): The ID of the installed Saleor app
-   `productId` (optional): Limit the cleanup to a specific product ID

### Functionality

The script:
1. Fetches all products from Saleor (or a specific product if provided)
2. For each product, processes all its media items
3. Generates image hashes for each media item
4. Groups media by hash to identify duplicates
5. Intelligently decides which duplicates to keep:
   - For variant-specific media, keeps one media item per variant combination
   - For product-level media, keeps one media item per unique image

## Variant Description Cleanup Script

This script identifies and resets variant website descriptions in Saleor that are no longer present in your local database. It helps maintain data consistency by ensuring that Saleor doesn't display descriptions that have been removed from your system.

### Usage

```bash
npx ts-node -r tsconfig-paths/register src/scripts/variant-description-cleanup.ts --app-id=<installedSaleorAppId> [--dry-run] [--product-id=<productId>]
```

### Parameters

-   `--app-id` or `-a` (required): The ID of the installed Saleor app
-   `--dry-run` or `-d` (optional): Run in dry-run mode, which will only report what would be changed without making actual changes
-   `--product-id` or `-p` (optional): Limit the cleanup to a specific product ID
-   `--help` or `-h`: Show help information

### Examples

Run the script for all products in dry-run mode:

```bash
npx ts-node -r tsconfig-paths/register src/scripts/variant-description-cleanup.ts --app-id=QXBwOjE= --dry-run
```

Run the script for a specific product in dry-run mode:

```bash
npx ts-node -r tsconfig-paths/register src/scripts/variant-description-cleanup.ts --app-id=QXBwOjE= --dry-run --product-id=UHJvZHVjdDo5MTY=
```

Run the script for all products and make actual changes:

```bash
npx ts-node -r tsconfig-paths/register src/scripts/variant-description-cleanup.ts --app-id=QXBwOjE=
```

### Functionality

The script:
1. Fetches all products from Saleor (or a specific product if provided)
2. For each product, processes all its variants
3. For each variant, checks if it has a `variant_website_description` attribute in Saleor
4. If it does, checks if the variant exists in your database and has the attribute there
5. If the variant doesn't have the attribute in your database but has it in Saleor, it resets the attribute to an empty value in Saleor

### Output

The script will log its progress and provide statistics at the end, including:

-   Total number of variants processed
-   Number of variants with a description in Saleor
-   Number of variants with a description that needed to be cleaned

## Best Practices

1. **Always run in dry-run mode first**: For scripts that support it, always run in dry-run mode first to see what changes would be made.
2. **Run on a specific product for testing**: If you're unsure about a script's behavior, test it on a single product first.
3. **Monitor logs**: All scripts provide detailed logging of their actions. Monitor these logs to ensure the script is behaving as expected.
4. **Schedule regular maintenance**: Consider scheduling these scripts to run regularly to maintain data consistency.

## Troubleshooting

If you encounter issues with any of the scripts:

1. Check that you have the correct `installedSaleorAppId`
2. Ensure your database connection is working properly
3. Verify that your Saleor API connection is working
4. Check the logs for specific error messages
5. Try running the script on a specific product to isolate the issue
