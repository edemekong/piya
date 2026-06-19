import Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { finalConfiguration } from "../../configs/configurations";

const templateCache: Record<string, HandlebarsTemplateDelegate> = {};
let partialsRegistered = false;

Handlebars.registerHelper("ifEquals", function (this: unknown, a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifNotEquals", function (this: unknown, a, b, options) {
  return a !== b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("default", function (value, defaultValue) {
  return value ?? defaultValue;
});

Handlebars.registerHelper("formatCurrency", function (amount, currency = "₦") {
  if (typeof amount !== "number") return `${currency}0`;
  return `${currency}${amount.toLocaleString()}`;
});

Handlebars.registerHelper("formatDate", function (timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
});

function registerPartials(): void {
  if (partialsRegistered) return;

  const partialsDir = path.join(__dirname, "html", "partials");
  if (fs.existsSync(partialsDir)) {
    const partialFiles = fs.readdirSync(partialsDir);
    partialFiles.forEach((file) => {
      if (file.endsWith(".html")) {
        const partialName = file.replace(".html", "");
        const partialPath = path.join(partialsDir, file);
        const partialContent = fs.readFileSync(partialPath, "utf-8");
        Handlebars.registerPartial(partialName, partialContent);
      }
    });
  }
  partialsRegistered = true;
}

function loadTemplate(templateName: string): HandlebarsTemplateDelegate {
  registerPartials();
  const templatePath = path.join(__dirname, "html", `${templateName}.html`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  return Handlebars.compile(templateContent);
}

function getTemplate(templateName: string): HandlebarsTemplateDelegate {
  if (!templateCache[templateName]) {
    templateCache[templateName] = loadTemplate(templateName);
  }
  return templateCache[templateName];
}

export function renderTemplate(
  templateName: string,
  data: Record<string, unknown>
): string {
  const template = getTemplate(templateName);
  const { appBranding } = finalConfiguration();

  return template({
    ...data,
    brand: appBranding,
    currentYear: new Date().getFullYear(),
  });
}

export function clearTemplateCache(): void {
  Object.keys(templateCache).forEach((key) => delete templateCache[key]);
  partialsRegistered = false;
}

export { Handlebars };
