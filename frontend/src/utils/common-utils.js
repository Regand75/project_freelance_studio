import config from "../config/config";

export class CommonUtils {
    static getLevelHtml(level) {
        let levelHtml = null;
        switch (level) {
            case config.freelancerLevels.junior:
                levelHtml = `<span class="badge badge-info">junior</span>`;
                break;
            case config.freelancerLevels.middle:
                levelHtml = `<span class="badge badge-warning">middle</span>`;
                break;
            case config.freelancerLevels.senior:
                levelHtml = `<span class="badge badge-success">senior</span>`;
                break;
            default:
                levelHtml = `<span class="badge badge-secondary">Unknown</span>`;
        }
        return levelHtml;
    }
}