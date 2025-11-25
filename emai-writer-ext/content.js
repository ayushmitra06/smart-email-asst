console.log("Email Writer Extension - Content Script Loaded");

function getRecipientName() {
    // Target Gmail "From" span: class gD, with name + email attributes
    const fromElement = document.querySelector('.gD[name][email]');
    if (fromElement) {
        let name = fromElement.getAttribute('name') || fromElement.innerText || '';
        if (name && name.trim().length > 0) {
            // Return only the first word (first name)
            return name.trim().split(/\s+/)[0];
        }
    }

    // Fallback to .g2 in case Gmail changes DOM
    const altFrom = document.querySelector('.g2[name][email]');
    if (altFrom) {
        let name = altFrom.getAttribute('name') || altFrom.innerText || '';
        if (name && name.trim().length > 0) {
            return name.trim().split(/\s+/)[0];
        }
    }

    // Last resort
    return "there";
}


function createAIButton() {
  const button = document.createElement("div");
  button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button";
  button.style.marginRight = "8px";
  button.innerHTML = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  return button;
}

function getEmailContent() {
  const selectors = [
    ".h7",
    ".a3s.aiL",
    ".a3s.aiL",
    ".gmail_quote",
    '[role="presentation"]',
    ".gU.Up",
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerHTML.trim();
    }
  }
  return "";
}

function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
  }
  return null;
}

function injectButton() {
  // Check if the button already exists to avoid duplicates
  const existingButton = document.getElementById(".ai-reply-button");
  if (existingButton) {
    existingButton.remove();
  }

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Compose toolbar not found.");
    return;
  }

  console.log("Compose toolbar found");

  const button = createAIButton();
  button.classList.add("ai-reply-button");

  button.addEventListener("click", async () => {
    try {
      button.innerHTML = "Generating...";
      button.disabled = true;

      const emailContent = getEmailContent();
      const recipientName = getRecipientName();

      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional",
          recipientName: recipientName, // NEW
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const generatedReply = await response.text();

      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        console.log("Compose box not found.");
      }
    } catch (error) {
      alert("Error generating AI reply:");
      console.error("Error:", error);
    } finally {
      button.innerHTML = "AI Reply";
      button.disabled = false;
    }
  });

  toolbar.insertBefore(button, toolbar.firstChild); // Insert button at the start of the toolbar
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);
    const hasComposeElements = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('.AD, .nH, .aoI, .aDh, .btC, [role="dialog"]') || // Gmail compose window classes
          node.querySelector('.AD, .nH, .aoI, .aDh, .btC, [role="dialog"]')) // or contains such elements
    );

    if (hasComposeElements) {
      console.log("Compose window detected. Injecting button...");
      setTimeout(injectButton, 500); // Delay to ensure elements are fully loaded
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
