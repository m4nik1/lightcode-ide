import type { ImageDetail } from "../ImageDetail.js";
import type { TextElement } from "./TextElement.js";
export type UserInput = {
    "type": "text";
    text: string;
    /**
     * UI-defined spans within `text` used to render or persist special elements.
     */
    text_elements: Array<TextElement>;
} | {
    "type": "image";
    detail?: ImageDetail;
    url: string;
} | {
    "type": "localImage";
    detail?: ImageDetail;
    path: string;
} | {
    "type": "skill";
    name: string;
    path: string;
} | {
    "type": "mention";
    name: string;
    path: string;
};
//# sourceMappingURL=UserInput.d.ts.map