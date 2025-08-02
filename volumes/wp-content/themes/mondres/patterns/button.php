<?php
/**
 * Title: Button (circle hover)
 * Slug: mondres/button-circle-hover
 * Categories: footer
 * Block Types: core/template-part/footer
 * Description: Footer columns with logo, title, tagline and links.
 *
 * @package WordPress
 * @subpackage Mondres
 * @since 1.0
 */

?>
<!-- wp:html -->
<button class="relative size-20 rounded-full group" id="circleBtn">
  <svg class="absolute top-0 left-0 w-full h-full rotate-[-90deg] pointer-events-none" viewBox="0 0 100 100">
    <circle id="circleBorder" cx="50" cy="50" r="48" fill="none" stroke="black" stroke-width="2" stroke-dasharray="301.59" stroke-dashoffset="301.59"></circle>
  </svg>
  <span class="absolute inset-0 flex items-center justify-center font-semibold z-10">
    Click
  </span>
</button>
<!-- /wp:html -->