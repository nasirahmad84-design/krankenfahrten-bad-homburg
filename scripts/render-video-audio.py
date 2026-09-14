"""Local Piper narration; no paid API. Run with .venv-video/bin/python."""
import json
import os
from pathlib import Path
import subprocess
import urllib.request
import wave
import tempfile
from piper import PiperVoice
from piper.phonemize_espeak import ESPEAK_DATA_DIR

root = Path(__file__).resolve().parents[1]
os.chdir(root)
models = root / 'artifacts/voices'
output = root / 'artifacts/remotion'
models.mkdir(parents=True, exist_ok=True)
output.mkdir(parents=True, exist_ok=True)
base = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/de/de_DE/thorsten/high/'
for name in ['de_DE-thorsten-high.onnx', 'de_DE-thorsten-high.onnx.json', 'MODEL_CARD']:
    path = models / name
    if not path.exists():
        temporary = path.with_suffix(path.suffix + '.download')
        urllib.request.urlretrieve(base + name, temporary)
        temporary.replace(path)
# espeak's native macOS path buffer cannot handle this deeply nested repository.
short_data = tempfile.TemporaryDirectory(prefix='piper-data-')
data_link = Path(short_data.name) / 'espeak-ng-data'
data_link.symlink_to(ESPEAK_DATA_DIR, target_is_directory=True)
voice = PiperVoice.load(models / 'de_DE-thorsten-high.onnx', espeak_data_dir=data_link)
compositor = root / 'node_modules/@remotion/compositor-darwin-arm64'
ffmpeg = compositor / 'ffmpeg'
env = {**os.environ, 'DYLD_LIBRARY_PATH': str(compositor)}
scenes = json.loads((root / 'remotion/narration.json').read_text())
inputs, filters = [], []
for i, scene in enumerate(scenes):
    path = output / f'narration-{i}.wav'
    with wave.open(str(path), 'wb') as wav:
        voice.synthesize_wav(scene['text'], wav)
    with wave.open(str(path), 'rb') as wav:
        duration = wav.getnframes() / wav.getframerate()
    factor = max(1.0, duration / (scene['end'] - scene['start']))
    if factor > 1.3:
        raise ValueError(f'Scene {i}: shorten narration; speed {factor:.2f} is too fast')
    inputs += ['-i', str(path)]
    delay = round(scene['start'] * 1000)
    filters.append(f'[{i}:a]atempo={factor},adelay={delay}:all=1[a{i}]')
filters.append(''.join(f'[a{i}]' for i in range(len(scenes))) + f'amix=inputs={len(scenes)}:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=7,apad,atrim=duration=30[out]')
audio = output / 'narration-30s.wav'
subprocess.run([str(ffmpeg), '-y', '-loglevel', 'error', *inputs, '-filter_complex', ';'.join(filters), '-map', '[out]', '-ar', '48000', str(audio)], env=env, check=True)
video = output / 'krankenfahrt-oder-krankentransport-1080x1920.mp4'
subprocess.run([str(ffmpeg), '-y', '-loglevel', 'error', '-i', str(video), '-i', str(audio), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', '30', '-movflags', '+faststart', str(output / 'krankenfahrt-mit-sprachspur.mp4')], env=env, check=True)
print('Video mit lokaler Thorsten-Sprachspur erzeugt; keine API-Gebühren.')
