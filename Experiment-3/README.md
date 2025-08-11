This HTML and CSS code creates a responsive Admin Dashboard with a light/dark mode toggle using pure CSS variables and the :has() selector.

The HTML defines a .dashboard container structured into three main sections:
Header: Spans the full width, containing the dashboard title and a theme toggle checkbox.
Navigation (nav): A vertical menu on the left with simple links.
Main: A content area for admin-related information.
Footer: Spans the bottom across both columns with copyright text.
The CSS starts by defining CSS custom properties (--bg-header, --bg-main, etc.) in the :root for colors and text. The layout uses CSS Grid (grid-template-columns: 200px auto;) to divide navigation and content areas. Flexbox is used inside the header for proper alignment.

The dark theme is applied when .dashboard has the checkbox #switchtheme checked. The :has() selector updates the custom properties to darker tones, instantly changing the theme without JavaScript.

The .theme-toggle styles the label and checkbox with proper spacing and cursor interaction. The navigation, footer, and main content all inherit background and text colors from the variables, ensuring consistent theme switching across the interface.


Final Output
The resulting page is a simple, professional-looking admin dashboard with:
A fixed layout,
Responsive content structure,
And a Dark Mode toggle to enhance user experience.