// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import SubscribeForm from "./components/SubscribeForm";
import GameplayVideo from "./components/home/GameplayVideo";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { subscribeWithMailerLite } from "./lib/mailerlite";

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  );
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(0), 0)
  );
  vi.stubGlobal("cancelAnimationFrame", window.clearTimeout);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("subscription UI", () => {
  it("rejects invalid addresses without submitting", () => {
    const submit = vi.fn();
    render(<SubscribeForm onSubscribe={submit} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "invalid" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  });
  it("shows submitting and waits for confirmation before success", async () => {
    let confirm!: () => void;
    const submit = vi.fn(
      () =>
        new Promise<void>(resolve => {
          confirm = resolve;
        })
    );
    render(<SubscribeForm onSubscribe={submit} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "controlled@example.com" },
    });
    fireEvent.click(screen.getByRole("button"));
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(
      true
    );
    expect(screen.getByText("Joining…")).toBeTruthy();
    confirm();
    await waitFor(() =>
      expect(screen.getByText(/You’re on the list/)).toBeTruthy()
    );
    expect(submit).toHaveBeenCalledOnce();
  });
  it("shows failure and permits retry", async () => {
    const submit = vi
      .fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValueOnce(undefined);
    render(<SubscribeForm onSubscribe={submit} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "controlled@example.com" },
    });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.getByText(/We couldn’t confirm/)).toBeTruthy()
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(screen.getByText(/You’re on the list/)).toBeTruthy()
    );
    expect(submit).toHaveBeenCalledTimes(2);
  });
});

describe("MailerLite bridge (local simulation, no network submission)", () => {
  function embed() {
    const root = document.createElement("div");
    root.id = "mlb2-35246848";
    root.innerHTML =
      '<input type="email"><button type="submit">Subscribe</button>';
    document.body.append(root);
    return root;
  }
  it("forwards the email and resolves only on the official callback event", async () => {
    const root = embed();
    const click = vi.spyOn(root.querySelector("button")!, "click");
    const request = subscribeWithMailerLite("controlled@example.com");
    expect(root.querySelector("input")!.value).toBe("controlled@example.com");
    expect(click).toHaveBeenCalledOnce();
    window.dispatchEvent(new CustomEvent("ml:subscribed"));
    await expect(request).resolves.toBeUndefined();
    root.remove();
  });
  it("fails when the embed is missing", async () => {
    await expect(
      subscribeWithMailerLite("controlled@example.com")
    ).rejects.toThrow("not available");
  });
  it("times out without a success callback", async () => {
    vi.useFakeTimers();
    const root = embed();
    const request = subscribeWithMailerLite("controlled@example.com");
    const assertion = expect(request).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(12000);
    await assertion;
    root.remove();
  });
});

it("loads the specified video on click and retains the Shorts fallback", () => {
  const { container } = render(<GameplayVideo />);
  expect(container.querySelector("iframe")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /Play the early/ }));
  const player = screen.getByTitle("Easing-Point — Early Prototype Demo");
  expect(player.getAttribute("src")).toContain(
    "/embed/q0WvfenTqc0?autoplay=1&playsinline=1"
  );
  expect(player.hasAttribute("allowfullscreen")).toBe(true);
  expect(document.activeElement).toBe(player);
  expect(screen.getByRole("link").getAttribute("href")).toBe(
    "https://www.youtube.com/shorts/q0WvfenTqc0"
  );
});

it("retains home anchors, article links, a single signup and no version numbers", () => {
  const { container } = render(
    <MemoryRouter>
      <Navbar />
      <Home />
    </MemoryRouter>
  );
  for (const anchor of ["console", "games", "notes", "contact"]) {
    expect(
      screen
        .getByRole("link", {
          name: {
            console: "Console",
            games: "Play",
            notes: "Devlog",
            contact: "Contact",
          }[anchor],
        })
        .getAttribute("href")
    ).toBe("#" + anchor);
  }
  expect(container.querySelectorAll("form").length).toBe(1);
  expect(container.textContent).not.toMatch(/\b[12]\.0\b/);
  expect(
    screen
      .getByRole("link", { name: /Exploring Spatial Interaction/i })
      .getAttribute("href")
  ).toBe("/devlog/2026-07-03");
});

it("opens the mobile menu, traps Tab and restores focus on Escape", async () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );
  const toggle = screen.getByRole("button", { name: "Open navigation" });
  toggle.focus();
  fireEvent.click(toggle);
  const mobile = screen.getByRole("navigation", { name: "Mobile navigation" });
  const links = mobile.querySelectorAll("a");
  await waitFor(() => expect(document.activeElement).toBe(links[0]));
  links[links.length - 1].focus();
  fireEvent.keyDown(document, { key: "Tab" });
  expect(document.activeElement).toBe(toggle);
  fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(links[links.length - 1]);
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() =>
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" })
    ).toBeNull()
  );
  expect(document.activeElement).toBe(toggle);
});

it("scrolls the home Play navigation to the demo", async () => {
  const { container } = render(
    <MemoryRouter>
      <Navbar />
      <Home />
    </MemoryRouter>
  );
  const demo = container.querySelector<HTMLElement>("#games")!;
  demo.scrollIntoView = vi.fn();
  fireEvent.click(screen.getByRole("link", { name: "Play" }));
  await waitFor(() =>
    expect(demo.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" })
  );
  expect(window.location.hash).toBe("#games");
  window.history.replaceState(null, "", "/");
});

it("returns from a devlog article to the home Console anchor", async () => {
  function RouteProbe() {
    const location = useLocation();
    return (
      <output aria-label="Current route">
        {location.pathname + location.hash}
      </output>
    );
  }
  render(
    <MemoryRouter initialEntries={["/devlog/2026-07-03"]}>
      <Navbar />
      <RouteProbe />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole("link", { name: "Console" }));
  await waitFor(() =>
    expect(screen.getByLabelText("Current route").textContent).toBe("/#console")
  );
});
