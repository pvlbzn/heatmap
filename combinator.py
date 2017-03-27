import os

from moviepy.editor import VideoFileClip
from moviepy.audio.io.AudioFileClip import AudioFileClip


def collect_files():
    '''Collect video and audio files.
    
    Returns:
        Tuple with two elements: list of movies, list of sounds
    '''
    movies = [
        f for f in os.listdir('movie')
        if os.path.isfile(os.path.join('movie', f))
    ]
    sounds = [
        s for s in os.listdir('sound')
        if os.path.isfile(os.path.join('sound', s))
    ]

    return (movies, sounds)


def combine(movies, sounds):
    '''Combine movies with sounds.'''

    # Sanity check
    if len(movies) != len(sounds):
        raise ValueError(
            'Number of movie files must be equal to number of sound files')

    for pair in range(len(movies)):
        clip = VideoFileClip('movie/' + movies[pair]).subclip(0, 15)
        sound = AudioFileClip('sound/' + sounds[pair]).subclip(40, 60)

        # Crop the sound to video length
        sound = sound.set_duration(clip.duration)
        # Add sound to clip
        clip = clip.set_audio(sound)

        # Write an output
        clip.write_videofile('outcome/' + str(pair + 1) + '.mp4')


if __name__ == '__main__':
    files = collect_files()
    combine(files[0], files[1])
