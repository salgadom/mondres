<?php
function theme_enqueue_assets() {
    // Switch between dev/prod
    $is_dev = wp_get_environment_type() === 'development';

    if ($is_dev) {
        // Load from Vite dev server
        wp_enqueue_script_module('vite-dev', 'http://localhost:5173/@vite/client', [], null, true);
        wp_enqueue_script_module('theme-dev', 'http://localhost:5173/src/main.js', [], null, true);
    } else {
        // Load from built /dist
        $manifest = json_decode(file_get_contents(get_template_directory() . '/dist/.vite/manifest.json'), true);
        $main = $manifest['src/main.js'];

        wp_enqueue_script('theme-prod', get_template_directory_uri() . '/dist/' . $main['file'], [], null, true);
        wp_enqueue_style('theme-style', get_template_directory_uri() . '/dist/' . $main['css'][0], [], null);
    }
}
add_action('wp_enqueue_scripts', 'theme_enqueue_assets');

function register_custom_list_styles() {
  register_block_style('core/group', [
    'name'  => 'timeline',
    'label' => 'Timeline',
  ]);
}
add_action('init', 'register_custom_list_styles');

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
        $newClass = 'relative border-s border-gray-200 dark:border-gray-700 pl-10 space-y-10';
        $group->setAttribute('class', $newClass);

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
            $wrapper = $dom->createElement('div');
            $wrapper->setAttribute('class', 'timeline-item');

            // Create the bullet dot <span>
            $dot = $dom->createElement('span');
            $dot->setAttribute('class', 'absolute flex items-center justify-center size-10 bg-blue-100 rounded-full -start-5 dark:bg-blue-900');
            $dot->textContent = $index + 1;
            $wrapper->appendChild($dot);

            // Append original child into wrapper
            $wrapper->appendChild($child);

            // Append wrapper into group
            $group->appendChild($wrapper);
        }
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