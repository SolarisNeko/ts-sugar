export class ClipboardUtils {

    static copy(text: string) {
        // web
        // Web Platform
        this.copyToClipboardInWeb0(text)
        console.log("Text copied to clipboard:", text);
    }


    // Custom function for copying to clipboard on the web
    private static copyToClipboardInWeb0(text: string) {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();

        try {
            document.execCommand('copy');
            console.log("Text copied to clipboard:", text);
        } catch (err) {
            console.error("Failed to copy text:", err);
        }

        document.body.removeChild(tempTextArea);
    }
}