You are a senior Shopify theme developer and premium e-commerce UI/UX engineer.

I am building a premium jewellery e-commerce website for a real client.

IMPORTANT:
Build this as a CUSTOM SHOPIFY THEME.

Do NOT build a React/Next.js/Hydrogen application.
Do NOT create a separate backend.
Do NOT replace Shopify's commerce functionality.

TECH STACK:
- Shopify Liquid
- HTML5
- CSS3
- Vanilla JavaScript
- Shopify JSON templates
- Shopify section schema
- Shopify metafields where appropriate
- Shopify CLI
- Git/GitHub

The Shopify platform will handle:
- Products
- Variants
- Inventory
- Orders
- Customers
- Discounts
- Cart
- Checkout
- Payments
- Shipping
- Store administration

The theme must provide a highly custom, premium frontend while remaining completely compatible with Shopify Admin.

==================================================
DESIGN DIRECTION
==================================================

Create a premium jewellery experience.

Design characteristics:
- Elegant
- Minimal
- Editorial
- Sophisticated
- High-end
- Spacious
- Product-focused
- Strong typography
- Excellent photography presentation
- Subtle luxury
- Smooth but restrained animations

Avoid:
- Generic Shopify-template appearance
- Excessive gradients
- Excessive glassmorphism
- Excessive shadows
- Huge amounts of animation
- Cheap-looking gold gradients
- Clutter
- AI-generated visual aesthetics
- Overly rounded UI everywhere
- Unnecessary UI elements

The website should feel like a premium jewellery brand, not a generic online store.

==================================================
RESPONSIVE DESIGN
==================================================

Design mobile-first.

Support:
- Mobile
- Tablet
- Laptop
- Large desktop

Pay particular attention to:
- Navigation
- Product gallery
- Product cards
- Filters
- Cart drawer
- Sticky purchase controls
- Typography
- Image cropping
- Touch interactions

Do not simply shrink desktop layouts.

Create intentionally designed mobile layouts.

==================================================
SITE STRUCTURE
==================================================

Build the following:

1. Homepage
2. Collection page
3. Product page
4. Search page
5. Cart
6. About page
7. Contact page
8. FAQ page
9. Shipping & Returns page
10. Privacy page
11. Terms page
12. 404 page

==================================================
HOMEPAGE
==================================================

Create these sections:

1. Announcement bar
2. Premium header/navigation
3. Hero section
4. Featured collections
5. Best sellers
6. Brand story
7. Shop by category
8. Craftsmanship / quality section
9. Featured jewellery editorial section
10. Testimonials
11. Instagram/social section
12. Newsletter
13. Footer

Every homepage section must be implemented as a Shopify section.

Each section must expose appropriate settings through {% schema %}.

Example editable settings:
- Heading
- Description
- Image
- Button text
- Button URL
- Products
- Collection
- Alignment
- Layout
- Visibility options

==================================================
HEADER
==================================================

Create a premium responsive header.

Desktop:
- Announcement bar
- Logo
- Navigation
- Search
- Account
- Wishlist
- Cart

Mobile:
- Menu button
- Centered logo
- Search
- Cart

Include:
- Sticky behavior
- Smooth transition when scrolling
- Mobile drawer navigation
- Accessible keyboard navigation
- Proper focus states

Do not use fake cart/account functionality.

Use Shopify's actual routes and functionality.

==================================================
PRODUCT CARD
==================================================

Create a reusable product-card snippet.

Include:
- Product image
- Hover image
- Product title
- Price
- Compare-at price
- Sale badge where appropriate
- Availability
- Wishlist button if supported
- Quick add where appropriate

Use Shopify's actual product data.

Images must use Shopify image filters properly and be responsive.

==================================================
COLLECTION PAGE
==================================================

Include:

- Collection title
- Collection description
- Product count
- Product grid
- Sorting
- Filtering where supported
- Pagination
- Empty state

Product cards should be reusable.

Ensure filters and sorting work with Shopify's actual collection/query behavior.

==================================================
PRODUCT PAGE
==================================================

Create a premium product detail experience.

Include:

- Product image gallery
- Thumbnail navigation
- Image zoom
- Product title
- Price
- Compare-at price
- Variant selector
- Quantity selector
- Add to cart
- Buy now / accelerated checkout where appropriate
- Availability
- SKU
- Product description
- Product specifications
- Material
- Purity
- Weight
- Stone information
- Size guide
- Shipping information
- Returns information
- Care instructions
- Certification information
- Related products

Use Shopify product/variant data.

Do not hardcode product information.

Where custom jewellery attributes are required, design the theme to support Shopify metafields.

==================================================
CART
==================================================

Implement a polished cart experience.

Support:

- Cart drawer
- Cart page
- Quantity update
- Remove item
- Line item properties where necessary
- Subtotal
- Checkout button
- Empty cart state

Use Shopify's actual cart functionality.

Do not create a fake cart system.

==================================================
SEARCH
==================================================

Implement Shopify-powered search.

Include:

- Search input
- Search results
- Product results
- Empty state
- Search suggestions if appropriate

==================================================
FOOTER
==================================================

Include:

- Brand description
- Navigation
- Customer support
- Policies
- Contact
- Social links
- Newsletter
- Copyright

Make footer content configurable where practical.

==================================================
SHOPIFY CUSTOMIZATION
==================================================

The merchant must be able to customize the website through Shopify's Theme Editor.

Do not hardcode content that should be editable.

Use section schema for:

- Text
- Images
- Products
- Collections
- Links
- Buttons
- Layout options
- Alignment
- Spacing where appropriate

Use blocks when the merchant should be able to add/remove/reorder repeated content.

Use Shopify presets where appropriate.

==================================================
METAFIELDS
==================================================

Design the product template to support custom jewellery information using Shopify metafields.

Potential metafields:

- Material
- Purity
- Weight
- Stone type
- Stone weight
- Certification
- Care instructions
- Size guide
- Delivery information

Do not assume metafields already exist.

Structure the theme so missing metafields do not break the page.

==================================================
ACCESSIBILITY
==================================================

Follow good accessibility practices.

Include:

- Semantic HTML
- Proper headings
- Labels
- Keyboard navigation
- Visible focus states
- ARIA only where required
- Accessible dialogs/drawers
- Alt text
- Sufficient contrast
- Reduced motion support

==================================================
PERFORMANCE
==================================================

Performance is extremely important.

Optimize:

- Images
- CSS
- JavaScript
- Fonts
- Lazy loading
- Above-the-fold content
- DOM size
- Third-party scripts

Avoid unnecessary JavaScript.

Do not load libraries just because they are convenient.

Prefer native browser APIs.

==================================================
ANIMATIONS
==================================================

Use subtle premium animations.

Examples:

- Image reveal
- Fade/slide
- Hover transitions
- Product image transitions
- Header transition
- Cart drawer animation
- Mobile menu animation

Animations must:
- Be fast
- Feel intentional
- Never interfere with usability
- Respect prefers-reduced-motion

Avoid excessive scroll animations.

==================================================
SEO
==================================================

Implement proper Shopify SEO foundations.

Include:

- Semantic HTML
- Proper title tags
- Meta descriptions
- Canonical URLs
- Open Graph metadata
- Twitter/social metadata
- Proper image alt text
- Structured data where appropriate
- Product structured data
- Breadcrumb structured data where appropriate

Use Shopify's native SEO variables where available.

==================================================
CODE QUALITY
==================================================

Follow these rules:

- Reusable snippets
- Reusable sections
- No unnecessary duplication
- Meaningful naming
- Clean Liquid
- Clean CSS
- Modular JavaScript
- Comments only where useful
- No dead code
- No console errors
- No hardcoded product data
- No fake API responses
- No placeholder functionality presented as complete functionality

==================================================
SHOPIFY COMPATIBILITY
==================================================

Use Shopify-native functionality wherever possible.

Do not reinvent:

- Product data
- Cart
- Checkout
- Customer authentication
- Inventory
- Collection logic
- Search
- Pricing

Use Shopify objects, filters, routes and APIs correctly.

==================================================
DEVELOPMENT PROCESS
==================================================

Build incrementally.

Phase 1:
Create theme architecture.

Phase 2:
Build global styles and design tokens.

Phase 3:
Build header/footer.

Phase 4:
Build homepage.

Phase 5:
Build collection page.

Phase 6:
Build product page.

Phase 7:
Build cart.

Phase 8:
Build search.

Phase 9:
Build static content pages.

Phase 10:
Add responsive behavior.

Phase 11:
Add animations.

Phase 12:
Accessibility and SEO.

Phase 13:
Performance optimization.

Phase 14:
Shopify Theme Check.

Phase 15:
Final QA.

Do not generate the entire project blindly in one step.

Before implementing a major feature, inspect the existing project structure and reuse existing components where possible.

==================================================
FINAL QA
==================================================

Before considering the theme complete, verify:

- Homepage works
- Navigation works
- Mobile menu works
- Search works
- Collections work
- Product pages work
- Variants work
- Add to cart works
- Cart updates work
- Checkout redirects correctly
- Product images work
- Missing images do not break layout
- Missing metafields do not break product page
- Mobile layout works
- Tablet layout works
- Desktop layout works
- Keyboard navigation works
- No console errors
- No Liquid errors
- Shopify Theme Check passes
- No broken links
- SEO metadata exists
- Images are optimized
- Reduced motion works

IMPORTANT:
Always prefer Shopify-native functionality over custom implementations.

The final result must be production-ready, maintainable, responsive, editable through Shopify Admin, and visually premium.