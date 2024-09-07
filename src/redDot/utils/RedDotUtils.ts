import {RedDotPath} from "../structs/RedDotPath";

export class RedDotUtils {

    /**
     * 创建红点事件 eventName | 唯一性
     * @param path
     * @param pathArgs
     */
    static createUniqueEventName(path: RedDotPath, pathArgs: any[]) {
        const templatePath = path.templatePath;
        // const defaultEventName = `${NotificationKey.RED_DOT_CHANGE}_${templatePath}`;

        return templatePath;

        // // no args
        // if (ArrayUtils.isEmpty(pathArgs)) {
        //     return defaultEventName;
        // }
        //
        // const kvTemplate = KvTemplate.create(defaultEventName);
        // for (let i = 0; i < pathArgs.length; i++) {
        //     kvTemplate.put(`key${i}`, pathArgs[i]);
        // }
        // return kvTemplate.render();
    }


}