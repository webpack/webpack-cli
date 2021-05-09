import defaultsGenerator from '@webpack-contrib/defaults/dist';

export function questions(): null {
    // no questions
    return;
}

/**
 * Runs the generator from webpack-defaults
 */
export function generate(): void {
    try {
        defaultsGenerator();
    } catch (e) {
        console.log(e);
    }
}
