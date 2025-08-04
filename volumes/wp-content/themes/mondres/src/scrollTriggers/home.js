import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const scrollLength = 4500

// window.addEventListener('DOMContentLoaded', () => {
//   const oldHost = 'http://localhost:8080';
//   const newHost = 'http://192.168.0.124:8080';

//   gsap.set(document.body, {
//     paddingTop: scrollLength
//   })

//   document.querySelectorAll('img').forEach((img) => {
//     // Replace src
//     if (img.src.includes(oldHost)) {
//       img.src = img.src.replace(oldHost, newHost);
//     }

//     // Replace srcset
//     if (img.srcset) {
//       img.srcset = img.srcset
//         .split(',')
//         .map(src => src.trim().replace(oldHost, newHost))
//         .join(', ');
//     }

    
// });
//     // Update <script> tags
//     document.querySelectorAll('script[src]').forEach((script) => {
//     if (script.src.includes(oldHost)) {
//         script.src = script.src.replace(oldHost, newHost);
//     }
//     });

//     // Update <link rel="stylesheet"> tags
//     document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
//     if (link.href.includes(oldHost)) {
//         link.href = link.href.replace(oldHost, newHost);
//     }
//     });
// });

export function home_setup() {
    ScrollTrigger.normalizeScroll(true)

    initScrollAnimation()

    let resizeTimeout;

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
            initScrollAnimation()
            ScrollTrigger.refresh() // Force recalculation
        }, 250) // Debounce resize
    });
}

let tagline
const tagline_setup = () => {
    const isMobile = getMobile()
    const navigation = document.getElementById("navigation")
    const site_tagline = navigation.querySelector(".wp-block-site-tagline")

    tagline = tagline || site_tagline.textContent
    const words = tagline
        .split(".")
        .filter((t) => t)
        .map((t) => `${t.trim()}`)

    const container = document.createElement("div")
    container.classList.add("tagline-word-container")

    const box = document.createElement("div")

    if (isMobile) {
        box.classList.add("relative", "-translate-x-8", "translate-y-7")
    } else {
        box.classList.add("relative", "translate-x-20", "-translate-y-10")
    }

    container.appendChild(box)

    const wordsMatrix = [
        // ["Mockup", "On-brand", "Navigation", "Development ", "Responsive", "Experience", "Support"],
        // ["Mockup", "Risk-free draft", "Preview our work"],
        // ["Monthly Plan", "Another way to pay", "No up-front cost"],
        ["ondres", "a London-based", "A Web & UX agency"],
        ["We craft", "Future-proof", "First impression"],
        ["From Wild ideas", "to Roaring", "Results"],
        // ["SEO", "Future-proof", "Results"],
        // ["Risk-free", "Mockup", "Preview us"],
        // ["Development ", "Responsive", "Experience"],
        // ["Wild", "ideas to", "Roaring Results"],
    ]

    wordsMatrix.forEach((words, index) => {
        const span = document.createElement("span")
        span.classList.add(
            "inline-flex", 
            "flex-col",
            "tagline-word",
            index < words.length - 1
                ? "tagline-word-rollin"
                : "tagline-word-rollin2",
            "text-nowrap",
            // "font-bold",
            isMobile ? "text-2xl" : "text-5xl",
            // isMobile ? "block" : null,
            "absolute",
            "left-0"
        )
        words.forEach((text, index) => {
            const span_block = document.createElement("span")
            const isFirstClassNames = index > 0 ? [
                "font-bold",
                // "font-normal",
            ]: [
                "font-bold",
                "text-gold-400"
            ]
            span_block.classList.add(
                "no-wrap", 
                ...isFirstClassNames
            )
            span_block.textContent = text
            span.appendChild(span_block)
        })
        box.appendChild(span)
    })

    // words.forEach((word, index) => {
    //     const span = document.createElement("span")
    //     span.textContent = word
    //     span.classList.add(
    //         "tagline-word",
    //         index < words.length - 1
    //             ? "tagline-word-rollin"
    //             : "tagline-word-rollin2",
    //         "text-nowrap",
    //         "font-bold",
    //         isMobile ? "text-2xl" : "text-5xl",
    //         isMobile ? "block" : null,
    //         "absolute",
    //         "left-0"
    //     )
    //     box.appendChild(span)
    // })

    navigation.appendChild(container)
    site_tagline?.remove()
}

function getWpadminbarHeight() {
    const wpadminbar = document.getElementById("wpadminbar")
    if (!wpadminbar || wpadminbar.classList.contains("mobile")) return 0
    return wpadminbar.getBoundingClientRect().height
}

function get_rollin_keyframes() {
    const originalSize = getComputedStyle(
        document.querySelector(".tagline-word")
    ).fontSize

    const rollin = {
        "0%": {
            fontSize: 0,
            autoAlpha: 0,
            marginLeft: -30,
            marginTop: 0,
            rotate: -25,
        },
        "3%": {
            autoAlpha: 1,
            rotate: 0,
        },
        "5%": {
            fontSize: originalSize,
            autoAlpha: 1,
            marginLeft: 0,
            marginTop: 0,
        },
        "20%": {
            fontSize: originalSize,
            autoAlpha: 1,
            marginLeft: 0,
            marginTop: 0,
            rotate: 0,
        },
        "27%": {
            fontSize: 0,
            autoAlpha: 0.5,
            marginLeft: 20,
            marginTop: 100,
        },
        "100%": {
            fontSize: 0,
            autoAlpha: 0,
            marginLeft: -30,
            marginTop: 0,
            rotate: 15,
        },
    }

    const rollin2 = {
        "0%": {
            fontSize: 0,
            autoAlpha: 0,
            marginLeft: -30,
            marginTop: 0,
            rotate: -25,
        },
        "3%": {
            autoAlpha: 1,
            rotate: 0,
        },
        "5%": {
            fontSize: originalSize,
            autoAlpha: 1,
            marginLeft: 0,
            marginTop: 0,
        },
        "20%": {
            fontSize: originalSize,
            autoAlpha: 1,
            marginLeft: 0,
            marginTop: 0,
            rotate: 0,
        },
        "37%": {
            fontSize: originalSize,
            autoAlpha: 1,
            marginLeft: 0,
            marginTop: 0,
            rotate: 0,
        },
        "100%": {
            fontSize: 1500,
            autoAlpha: 0,
            marginLeft: -1000,
            marginTop: -800,
        },
    }

    return {
        one: rollin,
        two: rollin2,
    }
}

function get_rollin_keyframes_2() {
    const originalSize = getComputedStyle(
        document.querySelector(".tagline-word")
    ).fontSize

    const rollin = {
        "0%": {
            fontSize: 0,
            autoAlpha: 0,
            marginLeft: -30,
            marginTop: 0,
            rotate: -25,
        },
        "33%": {
            fontSize: originalSize,
            autoAlpha: 1,
            marginLeft: 0,
            marginTop: 0,
            rotate: 0,
        },
        "66%": {
            fontSize: 0,
            autoAlpha: 0.5,
            marginLeft: 20,
            marginTop: 100,
        },
        "100%": {
            fontSize: 0,
            autoAlpha: 0,
            marginLeft: -30,
            marginTop: 0,
            rotate: 15,
        },
    }

    const rollin2 = {
        "0%": {
            fontSize: 0,
            autoAlpha: 0,
            marginLeft: -30,
            marginTop: 0,
            rotate: -25,
        },
        "50%": {
            fontSize: originalSize,
            autoAlpha: 1,
            marginLeft: 0,
            marginTop: 0,
            rotate: 0,
        },
        "100%": {
            fontSize: 1500,
            autoAlpha: 0,
            marginLeft: -1000,
            marginTop: -800,
        },
    }

    return {
        one: rollin,
        two: rollin2,
    }
}

let tl

function initScrollAnimation() {
    const navigation = document.getElementById("navigation")
    const site_logo = navigation.querySelector("#navSiteLogoWrap .wp-block-site-logo")

    // Kill existing ScrollTriggers if they exist
    if (tl) {
        tl.kill()
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
    
    document.querySelector(".tagline-word-container")?.remove()
    
    tagline_setup()

    // Set initial states
    gsap.set(".tagline-word", { autoAlpha: 0, transformOrigin: "0 bottom" })

    // Re-check mobile
    const isMobile = getMobile()

    tl = gsap.timeline({
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: `top+=${scrollLength} top`,
            scrub: true,
            // markers: true,
            onEnterBack: () => {
                document
                    .querySelector(".tagline-word-container")
                    .classList.remove("!hidden")
            },
            onLeave: () => {
                document
                    .querySelector(".tagline-word-container")
                    .classList.add("!hidden")
            },
        },
    })

    if (isMobile) {
        tl
            .fromTo(
                site_logo,
                {
                    marginLeft: 0,
                    marginRight: 0
                },
                {
                    x: -50,
                    duration: 6,
                },
                ".2"
            )
            .to(
                "#navSiteLogoWrap img",
                {
                    width: 200,
                    duration: 6,
                },
                "<"
            )
    } else {
        tl.to(
            site_logo,
            {
                x: -50,
                duration: 2,
            },
            "5"
        )
    }

    // const rollin_keyframes = get_rollin_keyframes()
    const rollin_keyframes = get_rollin_keyframes_2()

    const getDvhInPixels = () => window.visualViewport?.height || window.innerHeight;

    tl
        .to(
            ".tagline-word-rollin",
            {
                keyframes: rollin_keyframes.one,
                stagger: 50,
                duration: 100,
            },
            "<-1"
        )
        .to(
            ".tagline-word-rollin2",
            {
                keyframes: rollin_keyframes.two,
                duration: 100,
            },
            "<+100"
        )
        .fromTo(
            navigation,
            {
                height: getDvhInPixels,
                backgroundColor: "#fff",
            },
            {
                height: 100 + getWpadminbarHeight(),
                backgroundColor: "transparent",
                duration: 50,
            },
            ">"
        )
        .to(
            site_logo,
            {
                marginLeft: 0,
                marginRight: 0,
                y: 0,
                x: 0,
                duration: 50,
            },
            "<"
        )
        .to(
            "#navSiteLogoWrap img",
            {
                width: 80,
                duration: 50,
            },
            "<"
        )
        .fromTo(
            "#topNav",
            {
                top: 500,
                x: -500,
            },
            {
                autoAlpha: 1,
                top: getWpadminbarHeight(),
                x: 0,
                duration: 50,
            },
            "<"
        )
}

function getMobile() {
    return window.innerWidth <= 768
}