<?php
function mondres_enqueue_assets() {
    // Switch between dev/prod
    $is_dev = wp_get_environment_type() === 'development';

    if ($is_dev) {
        // Load from Vite dev server
        wp_enqueue_script_module('mondres-dev-script', 'http://localhost:5173/@vite/client', [], null, true);
        wp_enqueue_script_module('mondres-dev-style', 'http://localhost:5173/src/main.js', [], null, true);
    } else {
        // Load from built /dist
        $manifest = json_decode(file_get_contents(get_template_directory() . '/dist/.vite/manifest.json'), true);
        $main = $manifest['src/main.js'];

        wp_enqueue_script('mondres-prod-script', get_template_directory_uri() . '/dist/' . $main['file'], [], null, true);
        wp_enqueue_style('mondres-prod-style', get_template_directory_uri() . '/dist/' . $main['css'][0], [], null);
    }
    
    wp_enqueue_style('mondres-prod-style', get_template_directory_uri() . '/style.css', [], null);
    wp_enqueue_script('mondres-prod-script', get_template_directory_uri() . '/dist_iife/glow.js', [], '1.3', true);
}
add_action('wp_enqueue_scripts', 'mondres_enqueue_assets');

function register_custom_group_styles() {
  register_block_style('core/group', [
    'name'  => 'timeline',
    'label' => __('Timeline', 'mondres'),
  ]);
  register_block_style('core/group', [
    'name'  => 'bg-glow-hover',
    'label' => __('BG Glow (hover)', 'mondres'),
  ]);
  register_block_style('core/navigation', [
    'name'  => 'custom',
    'label' => __('Custom', 'mondres'),
  ]);
}
add_action('init', 'register_custom_group_styles');

function modify_timeline_group_html($html) {
    // Load the HTML
    $dom = new DOMDocument();
    libxml_use_internal_errors(true); // Suppress HTML5 parsing warnings
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $html);
    libxml_clear_errors();

    $xpath = new DOMXPath($dom);

    // Find all group blocks with is-style-timeline and is-vertical
    $groupBlocks = $xpath->query('//div[contains(@class, "wp-block-group") and contains(@class, "is-style-timeline") and contains(@class, "is-vertical")]');

    foreach ($groupBlocks as $group) {
        // Add Tailwind classes to the group block
        $existingClasses = $group->getAttribute('class');
        $group->setAttribute('class', $existingClasses 
                . " pl-5"
                . " [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] [mask-mode:alpha] [mask-repeat:no-repeat] [mask-size:100%_100%]"
        );

        $timeline = $dom->createElement('div');
        $timeline->setAttribute('class', 
            "pb-24 relative border-s border-white dark:border-gray-700 pl-10 space-y-10"
        );

        $children = [];
        foreach ($group->childNodes as $child) {
            if ($child->nodeType === XML_ELEMENT_NODE) {
                $children[] = $child;
            }
        }

        // Remove all children first (we'll re-wrap them)
        foreach ($children as $index => $child) {
            $group->removeChild($child);

            // Create wrapper
            $timeline_item = $dom->createElement('div');
            $timeline_item->setAttribute('class', 'timeline-item');

            // Create the bullet dot <span>
            $dot = $dom->createElement('span');
            $dot->setAttribute('class', 'absolute flex items-center justify-center size-10 bg-amber-500 rounded-full -start-5 dark:bg-blue-900');
            $dot->textContent = $index + 1;
            $timeline_item->appendChild($dot);

            // Append original child into wrapper
            $timeline_item->appendChild($child);

            // Append wrapper into group
            // $group->appendChild($timeline_item);
            $timeline->appendChild($timeline_item);
        }
        
        $group->appendChild($timeline);
    }

    // Return modified HTML
    $body = $dom->getElementsByTagName('body')->item(0);
    $newHtml = '';
    foreach ($body->childNodes as $child) {
        $newHtml .= $dom->saveHTML($child);
    }

    return $newHtml;
}
add_filter('render_block_core/group', function ($block_content, $block) {
    // Only apply to blocks with timeline class
    if (!empty($block['attrs']['className']) && strpos($block['attrs']['className'], 'is-style-timeline') !== false) {
        $block_content = modify_timeline_group_html($block_content);
    }
    return $block_content;
}, 10, 2);



add_filter('render_block_core/group', function ($block_content, $block) {
    // Check if our custom style is applied
    if (empty($block['attrs']['className']) || strpos($block['attrs']['className'], 'is-style-bg-glow-hover') === false) {
        return $block_content;
    }

    // Load content into DOMDocument safely
    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $block_content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();

    $xpath = new DOMXPath($dom);
    $container = $xpath->query("//*[contains(@class, 'wp-block-group')]")->item(0);

    if ($container) {
        $wrapper = $dom->createElement('div');
        $wrapper->setAttribute('data-glow-hover', null);
        $wrapper->setAttribute('class', 'group relative cursor-pointer');

        $container->parentNode->replaceChild($wrapper, $container);
        $wrapper->appendChild($container);

        // Create overlay div
        $overlay = $dom->createElement('div');
        $overlay->setAttribute('class', 'absolute inset-0 z-0 opacity-0 group-hover:opacity-100 duration-100 transition-opacity pointer-events-none');
        $overlay->setAttribute('style', '
            background-image: radial-gradient(circle 80px at var(--x2) var(--y2), rgb(255 147 57 / 18%) 0%, transparent 90% 80%), radial-gradient(circle 100px at var(--x) var(--y), rgb(41 241 255 / 28%) 0%, transparent 80%)
        ');
        $wrapper->appendChild($overlay);
    }

    // Return the modified HTML
    return $dom->saveHTML();
}, 10, 2);

add_filter('render_block_core/navigation', function ($block_content, $block) {
    // Only target nav blocks with class is-style-custom
    if (
        empty($block['attrs']['className']) ||
        strpos($block['attrs']['className'], 'is-style-custom') === false
    ) {
        return $block_content;
    }

    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    $dom->loadHTML('<?xml encoding="utf-8" ?>' . $block_content);
    libxml_clear_errors();

    $xpath = new DOMXPath($dom);
    $body = $dom->getElementsByTagName('body')->item(0);
    $nav = $xpath->query('//nav')->item(0);
    if (!$nav) return $block_content;

    // Clone the <ul> if it exists
    $ul = $xpath->query('//ul')->item(0);
    if ($ul) {
        $ul->setAttribute('class', 'menu-list flex flex-col gap-6'); // Your custom <ul> classes

        // Loop through all <li> children and update classes
        foreach ($ul->getElementsByTagName('li') as $li) {
            $li->setAttribute('class', 'menu-item');
            // ✅ Modify all <a> tags
            foreach ($li->childNodes as $child) {
                $child->setAttribute('class', 'px-3 text-lg !no-underline transition-all');
            }
        }
    }

    // Create custom nav wrapper
    $wrapper = $dom->createElement('nav');
    $wrapper->setAttribute('class', 'responsive-nav');

    // Burger/trigger button
    $triggerHTML = '
      <div onclick="menu(this)" class="backdrop-blur-sm bg-black/25 fixed flex items-center justify-center right-6 ring-1 ring-white/20 rounded-full size-12 top-0 trigger z-50">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" class="size-8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" class="bars hidden"></path>
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" class="x-mark"></path>
        </svg>
      </div>
    ';
    $trigger = $dom->createDocumentFragment();
    $trigger->appendXML($triggerHTML);

    // Create custom menu div and move updated <ul> into it
    $menuDiv = $dom->createElement('div');
    $menuDiv->setAttribute('class', 'bg-gradient-to-r from-blue-200 to-violet-200 font-bold gap-8 menu pb-5 pt-10 px-5 flex-col max-w-xs w-full right-4 h-auto rounded-lg fixed z-40 -translate-y-full flex opacity-0 transition-all duration-300' . ' translate-y-0 opacity-100');

    if ($ul) {
        $menuDiv->appendChild($ul->cloneNode(true));
    }

    $wrapper->appendChild($trigger);
    $wrapper->appendChild($menuDiv);
    $body->replaceChild($wrapper, $nav);

    // Clean output
    $html = $dom->saveHTML();
    $html = preg_replace('/^<!DOCTYPE.+?>/', '', $html);
    $html = str_replace(['<html>', '</html>', '<body>', '</body>'], '', $html);

    return trim($html);
}, 10, 2);
