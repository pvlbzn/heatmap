# Research

## Video Format
According to YouTube documentation they support following encoding:

```
.MOV
.MPEG4
.MP4
.AVI
.WMV
.MPEGPS
.FLV
.3GPP
.WebM
```

Source https://support.google.com/youtube/troubleshooter/2888402?hl=en



## Google Recommendations for Encoding
*Container*: `MP4`,
*Audio codec*: `ACC-LC`,
*Video codec*: `H.264`

Source: https://support.google.com/youtube/answer/1722171?hl=en



## Available Solutions
It turns out that there are exists libs for Python and Java, but all of them
use one common library: FFMPEG.

*FFMPEG*: https://github.com/FFmpeg/FFmpeg

*Python*: https://github.com/Zulko/moviepy (ffmpeg)
*Python*: https://ffmpy.readthedocs.io/en/latest/ (ffmpeg)
*Java*: https://github.com/artclarke/xuggle-xuggler (ffmpeg)
*Java*: https://github.com/artclarke/humble-video (ffmpeg)

Note on *Java*: stackoverflow solutions for multiplexing audio and video usually
boils down to `ffmpeg` usage.


## Performance
Since both languages rely on one common library, we can safely assume that `ffmpeg`
is fastest available solution. Therefore it makes sense to compare performance
of different solutions to pure `ffmpeg` lib.

Input video:

```
Size:            720p
Codec:           H.264
Length (in sec): 206
```

Using `time` unix utility, lets call `ffmpeg`:

`ffmpeg` (reference): 57.3 seconds

```
ffmpeg -i movie/1.mp4 -i sound/1.mp3 -shortest out.mp4

319.75s user 1.99s system 560% cpu
57.352 total
```

`moviepy`: 78.38 seconds

```
python3 combinator.py

425.01s user 15.92s system 562% cpu
1:18.38 total
```

`ffmpy`: 54.36 seconds

```
python3 combinator.py

318.11s user 2.14s system 589% cpu
54.366 total
```

#### Score
_Performance wise_: both `ffmpeg` and `ffmpy` got the same result. Their median
is 55.83 sec, which has `3.68` ratio.

_Feature wise_: `moviepy` has much more functionality than `ffmpeg` because
is is a superset of former. However there is a performance price, in particular
ratio is `2.62`.

What does it mean:
If you have, say 100 videos which are like sample video in terms of its properties,
with pure `ffmpeg` or its wrapper, `ffmpy`, it will take ~93 minutes. With `moviepy`
it will take ~131 minutes.

Question:
Time complexity of pure `ffmpeg` and `moviepy` grows both linearly, with a constant
difference. What is better in a long shot - win functionality or win some minutes?
In scale of say 500 videos both solutions will mean to leave server to proccess videos
for a night.

Remark:
Good point is that _animations_ will be processed faster than "natural video", it
simply contains much less information in each frame -> faster to compute.
