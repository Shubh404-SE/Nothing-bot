import { translate } from "google-translate-api-x";

import { ProviderError } from "../../shared/errors/provider.error.js";
import type {
  TranslateParams,
  TranslateResult,
  TranslationProvider,
} from "./translation-provider.interface.js";

export class GoogleTranslateProvider implements TranslationProvider {
  async translate(params: TranslateParams): Promise<TranslateResult> {
    try {
      const result = await translate(params.text, {
        to: params.targetLang,
        from: params.sourceLang ?? "auto",
      });

      return {
        translatedText: result.text,
        detectedSourceLang:
          typeof result.from?.language?.iso === "string" ? result.from.language.iso : undefined,
      };
    } catch (error) {
      throw new ProviderError("Translation provider request failed", { cause: error });
    }
  }
}
