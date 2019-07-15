const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_YEAR = 31536000;
const SECONDS_PER_MONTH = 2592000;
const SECONDS_PER_WEEK = 604800;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_MINUTE = 60;

const timeAgo = date => {
    const seconds = Math.floor((new Date() - date) / MILLISECONDS_PER_SECOND);

    let interval = Math.floor(seconds / SECONDS_PER_YEAR);

    if (interval > 1) {
        return `${interval} years ago`;
    }
    interval = Math.floor(seconds / SECONDS_PER_MONTH);
    if (interval > 1) {
        return `${interval} months ago`;
    }
    interval = Math.floor(seconds / SECONDS_PER_WEEK);
    if (interval > 1) {
        return `${interval} weeks ago`;
    }
    interval = Math.floor(seconds / SECONDS_PER_DAY);
    if (interval > 1) {
        return `${interval} days ago`;
    }
    interval = Math.floor(seconds / SECONDS_PER_HOUR);
    if (interval > 1) {
        return `${interval} hours ago`;
    }
    interval = Math.floor(seconds / SECONDS_PER_MINUTE);
    if (interval > 1) {
        return `${interval} minutes ago`;
    }
    return "just now";
};

export default timeAgo;
