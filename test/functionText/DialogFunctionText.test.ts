import {DialogFunctionText} from "../../src/functionText/DialogFunctionText";

describe('DialogFunctionText', () => {
    it('should parse function text and content correctly', () => {
        const input = '[Tutorial(target="pool_btn_building_workshop_formula_first_item", searchBtnInChildren=true, waitForSignal="building_workshop_home_resumed", animStyle="Click", focusStyle="HighlightRect", black="$f_tut_black", protectTime=0.5, dialogHead="$avatar_closure", dialogX="$f_lower_dialog_pos_x", dialogY="$f_lower_dialog_pos_y")] 点击选中配方';
        const dialogFunctionText = new DialogFunctionText(input);

        expect(dialogFunctionText.functionText.functionName).toBe('Tutorial');
        expect(dialogFunctionText.textContent).toBe('点击选中配方');
        expect(dialogFunctionText.functionText.kvMap.get('target')).toBe('pool_btn_building_workshop_formula_first_item');
        expect(dialogFunctionText.functionText.kvMap.get('searchBtnInChildren')).toBe(true);
        expect(dialogFunctionText.functionText.kvMap.get('waitForSignal')).toBe('building_workshop_home_resumed');
        expect(dialogFunctionText.functionText.kvMap.get('animStyle')).toBe('Click');
        expect(dialogFunctionText.functionText.kvMap.get('focusStyle')).toBe('HighlightRect');
        expect(dialogFunctionText.functionText.kvMap.get('black')).toBe('$f_tut_black');
        expect(dialogFunctionText.functionText.kvMap.get('protectTime')).toBe(0.5);
        expect(dialogFunctionText.functionText.kvMap.get('dialogHead')).toBe('$avatar_closure');
        expect(dialogFunctionText.functionText.kvMap.get('dialogX')).toBe('$f_lower_dialog_pos_x');
        expect(dialogFunctionText.functionText.kvMap.get('dialogY')).toBe('$f_lower_dialog_pos_y');
    });

    it('should throw error for invalid input format', () => {
        const input = '[Tutorial(target="pool_btn_building_workshop_formula_first_item")]';
        expect(() => new DialogFunctionText(input)).not.toBeNull();
    });
});
