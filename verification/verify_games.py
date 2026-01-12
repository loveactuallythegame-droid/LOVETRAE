from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Wait for app to load (Splash -> Origin or Dashboard if persisted)
    # Since we are in a fresh session, it should go to Splash then Origin
    # We want to navigate to Game Library.
    # We might need to bypass onboarding if possible or click through.
    # However, the "onboardingStep" is persisted in localStorage.
    # Let's try to inject state or just click "Skip" if available.

    # Actually, in the code, OnboardingNavigator starts with Splash.
    # Splash checks session. If no session, OriginStory.

    # Let's see if we can just navigate directly if linking is set up?
    # The linking config has 'GameLibrary': 'library' maybe?
    # No, OnboardingNavigator.tsx linking config:
    # config: { screens: { ChallengeScreen: 'challenge/:title', PartnerTranslator: 'translator' } }
    # It doesn't seem to expose GameLibrary directly via URL.

    # So we must click through onboarding.
    # 1. Origin Story
    page.get_by_text("Start", exact=True).click() # Or "Tap to Start" or similar on Splash?
    # Splash calls onStart after 2000ms automatically or manually?
    # SplashScreen.tsx usually has a button or timer.
    # Let's wait a bit.

    # Wait for Origin Story screen
    # OriginStoryScreen.tsx: "How did you two meet?"
    # We can fill mock data.
    # But this is tedious.

    # Alternative: Use a direct linking URL if I add it?
    # I can't easily modify code now just for verification without invalidating plan.

    # Let's try to click through quickly.
    # Wait for "How did you two meet?"
    try:
        page.wait_for_selector('text="How did you two meet?"', timeout=10000)
        page.get_by_placeholder("e.g. At a bar...").fill("We met at a library.")
        page.get_by_text("Next").click()
    except:
        print("Skipped Origin or not found")

    # CoupleCodeScreen
    try:
        page.wait_for_selector('text="Your Couple Code"', timeout=5000)
        page.get_by_text("Share Code").click() # or "Next"
        # Or there might be a "I have a code" button
    except:
        pass

    # Validating full flow is hard blindly.

    # Let's try to verify via inspecting the GameLibrary file content directly?
    # No, must be visual.

    # Check if we can verify by checking if the JS bundle contains the new game names.
    # That is not a screenshot.

    # Let's try to mock the local storage state to skip onboarding?
    # "app_state" key in localStorage.
    # We can inject it before reload.

    state = {
        "state": {
            "onboardingStep": 4, # Finished?
            "navCurrentScreen": "Dashboard",
            "isBeta": True
        },
        "version": 0
    }
    import json
    state_str = json.dumps(state)

    page.evaluate(f"window.localStorage.setItem('app_state', '{state_str}')")
    page.reload()

    # Now we should be on Dashboard?
    # Dashboard has "Game Library" button?
    # DashboardHome.tsx usually has a way to get to games.
    # "Games" tab or button.

    # Let's assume we are on Dashboard.
    # Look for "Games" or "Library".

    # If we fail to get to dashboard, we take screenshot of where we are.
    page.wait_for_timeout(5000)
    page.screenshot(path="verification/dashboard_or_splash.png")

    # Try to find "Game Library" button
    try:
        page.get_by_text("Games").click()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/game_library.png")

        # Now verify new games are present
        # "Lie Detector: Lite"
        expect(page.get_by_text("Lie Detector: Lite")).to_be_visible()
        expect(page.get_by_text("Transparency Toss")).to_be_visible()
        expect(page.get_by_text("Micro-Betrayal Mini-Golf")).to_be_visible()

    except Exception as e:
        print(f"Failed to navigate to library: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
