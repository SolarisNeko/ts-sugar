/**
 * @FromDataGenerateField
 * 标记用, 该 field 是从数据中生成的
 *
 * @param desc 描述
 */
export function FromDataGenerateField(desc: string = ""): PropertyDecorator {
    return ($target: Object,
            $propertyKey: string,
    ) => {
        return
    };
}
