from playwright.sync_api import sync_playwright, expect
import json

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Pre-inject state to skip onboarding
    # We navigate to 404 first to set local storage safely for the domain
    page.goto("http://localhost:5173/404")

    state = {
        "state": {
            "onboardingStep": 10,
            "navCurrentScreen": "Dashboard",
            "isBeta": True,
            "trustLevel": 0.5,
            "user_id": "preview"
        },
        "version": 0
    }
    state_str = json.dumps(state)
    page.evaluate(f"window.localStorage.setItem('app_state', '{state_str}')")

    # Go to root
    page.goto("http://localhost:5173")

    # Wait for dashboard
    try:
        page.wait_for_timeout(5000)
        page.screenshot(path="verification/dashboard_attempt.png")

        # Try to find "Game Library" or "Games"
        # It might be in a "FeatureCard" or Bottom Tab.
        # Let's search for "Game Library" text.

        # If we are on DashboardHome, there should be a "Game Library" card or button.
        # "Game Library" text is in the card.

        if page.get_by_text("Game Library").count() > 0:
             page.get_by_text("Game Library").first.click()
        elif page.get_by_text("Games").count() > 0:
             page.get_by_text("Games").first.click()
        else:
             print("Could not find Game Library link")

        page.wait_for_timeout(2000)
        page.screenshot(path="verification/game_library_v2.png")

        # Verify specific new games
        # Scroll down if needed? Playwright finds elements even if scrolled out usually, but visibility check matters.

        # "Lie Detector: Lite"
        # "Transparency Toss"

        # Let's check for text presence in page content
        content = page.content()
        if "Lie Detector: Lite" in content:
            print("Found Lie Detector: Lite")
        else:
            print("Missing Lie Detector: Lite")

        if "Micro-Betrayal Mini-Golf" in content:
             print("Found Micro-Betrayal Mini-Golf")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
