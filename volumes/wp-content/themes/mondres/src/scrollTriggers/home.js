import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function home_setup() {
    // ScrollTrigger.normalizeScroll(true)

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
        box.classList.add("relative", "translate-x-20", "translate-y-14")
    }

    container.appendChild(box)

    words.forEach((word, index) => {
        const span = document.createElement("span")
        span.textContent = word
        span.classList.add(
            "tagline-word",
            index < words.length - 1
                ? "tagline-word-rollin"
                : "tagline-word-rollin2",
            "text-nowrap",
            "font-bold",
            isMobile ? "text-2xl" : "text-5xl",
            isMobile ? "block" : null,
            "absolute",
            "left-0"
        )
        box.appendChild(span)
    })

    navigation.appendChild(container)
    site_tagline?.remove()
}

const updateBodyPaddingTop = () => {
    const navigation = document.getElementById("navigation")
    const topNav = document.getElementById("topNav")

    gsap.set(document.body, {
        paddingTop:
            + navigation.getBoundingClientRect().height 
            + window.scrollY 
        // document.getElementById("mainPage").getBoundingClientRect().top
            // - topNav.getBoundingClientRect().height 
            // + navigation.getBoundingClientRect().height 
            // + window.scrollY 
            // - getWpadminbarHeight(),
    })
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
    updateBodyPaddingTop()

    // Set initial states
    gsap.set(".tagline-word", { autoAlpha: 0, transformOrigin: "0 bottom" })

    // Re-check mobile
    const isMobile = getMobile()

    tl = gsap.timeline({
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "+=2500",
            scrub: true,
            // markers: true,
            onUpdate: () => {
                updateBodyPaddingTop()
            },
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
        tl.to(
            site_logo,
            {
                x: -110,
                duration: 2,
            },
            ".2"
        ).to(
            "#navSiteLogoWrap img",
            {
                width: 200,
                duration: 2,
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
            ".2"
        )
    }

    const rollin_keyframes = get_rollin_keyframes()

    tl.to(
        ".tagline-word-rollin",
        {
            keyframes: rollin_keyframes.one,
            stagger: 8,
            duration: 36,
        },
        "<"
    )
        .to(
            ".tagline-word-rollin2",
            {
                keyframes: rollin_keyframes.two,
                duration: 24,
            },
            "<+16"
        )
        .to(
            navigation,
            {
                height: 100 + getWpadminbarHeight(),
                paddingTop: getWpadminbarHeight(),
                backgroundColor: "#fff",
                duration: 20,
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
                duration: 20,
            },
            "<"
        )
        .to(
            "#navSiteLogoWrap img",
            {
                width: 80,
                duration: 20,
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
                duration: 20,
            },
            "<"
        )
}

function getMobile() {
    return window.innerWidth <= 768
}