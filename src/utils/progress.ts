import { Bar, Presets } from 'cli-progress';
import { Progress } from 'got/dist/source';
import { cyan } from 'colors';

export default class ProgressBar {
	bar: Bar;
	time: number;
	uploaded: number;

	constructor(inMB: boolean, public size: number, public divider: number) {
		this.bar = new Bar({ format: `uploading [${cyan('{bar}')}] {percentage}% | {value}/{total} ${inMB ? 'm' : 'k'}b | {speed} | Elapsed: {duration_formatted} | ETA: {eta_formatted}` }, Presets.rect);
		this.bar.start(size, 0, { speed: 0 });
		this.time = new Date().getTime();
		this.uploaded = 0;
	}

	progress(progress: Progress) {
		const transferred = progress.transferred;
		const speed = (transferred - this.uploaded) / (new Date().getTime() - this.time);

		this.time = new Date().getTime();
		this.uploaded = transferred;

		this.bar.update(parseFloat((transferred / this.divider).toFixed(2)), {
			speed: `${parseFloat((Number.isFinite(speed) ? (speed > 1024 ? speed / 1024 : speed) : 0).toFixed(2))} ${Number.isFinite(speed) && speed > 1024 ? 'm' : 'k'}b/s`,
		});
	}

	finish() {
		this.bar.update(this.size);
		this.bar.stop();
	}
}
