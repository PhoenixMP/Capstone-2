import os
import subprocess


def convert_midi_to_mp3(input_folder, output_folder):
    # Create the output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    # Iterate through all MIDI files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith(".mid"):
            input_file = os.path.join(input_folder, filename)
            output_file = os.path.join(
                output_folder, f"{os.path.splitext(filename)[0]}.mp3")

            # Use timidity to convert MIDI to WAV
            wav_file = os.path.join(
                output_folder, f"{os.path.splitext(filename)[0]}.wav")
            subprocess.run(["timidity", "-Ow", "-o", wav_file,
                           input_file], capture_output=True)

            # Use ffmpeg to convert WAV to MP3
            subprocess.run(["ffmpeg", "-i", wav_file,
                           output_file], capture_output=True)

            # Delete the temporary WAV file
            os.remove(wav_file)

            print(f"Converted {input_file} to {output_file}")


# Usage
input_folder = "/path/to/input/folder"
output_folder = "/path/to/output/folder"
convert_midi_to_mp3('./notes', './mp3')
