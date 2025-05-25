import {VideoProgress, User} from './model.js'



export const getVideoProgress = async (req, res) => {
    const { userId=1, videoId='lesson-1' } = req.query;
    try {
        const progress = await VideoProgress.findOne({ userId, videoId });
        if (!progress) {
            return res.status(404).json({ message: 'Progress not found'});
        }
        res.status(200).json({ message:"Success", data:progress});
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message})
    }
}

export const updateVideoProgress = async (req, res) => {
    const { userId=1, videoId='lesson-1'} = req.params;
    let { start, end, duration=0 } = req.body;
    start = parseInt(start);
    end = parseInt(end);
     if (typeof start !== 'number' || typeof end !== 'number') {
        
    return res.status(400).json({ error: 'start/end must be numbers' });
  }
    

    try {
        let progress = await VideoProgress.findOne({ userId, videoId });
        
        if(!progress) {
            progress = new VideoProgress({
                userId,
                videoId,
                segments: [{ start:start, end:end }],
                totalWatchedSeconds: end - start,
                progress: (duration && duration>0) ? ((end - start) / duration) * 100 : 0,
                completed : duration == (end - start) ? true : false,
            })
        }else{
            const updatedSegments = [...progress.segments, {start:start, end:end}];
            const merged = mergeSegments(updatedSegments);

            const totalWatchedSeconds = merged.reduce((acc, seg) => acc + (seg.end - seg.start), 0);

            progress.segments = merged;
            progress.totalWatchedSeconds = totalWatchedSeconds;
            progress.progress = duration ? (totalWatchedSeconds / duration) * 100 : 0;
            progress.completed = (totalWatchedSeconds / duration* 100) === 100;


        }
        await progress.save();
        res.status(200).json({ message: 'Progress updated successfulley', data: progress})

    }catch (error) {
        
      res.status(500).json({ message: 'Server error', error: error.message})
    }
}

export const createUser = async (req, res) => {
    const { userId, username, password } = req.body;
    try {
        const user  = new User({
            userId,
            username,
            password
        })
        user.save();
        return res.status(201).json({ message: 'User created successfully', data: user });
    }catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message})
    }
}
export const getUser = async (req, res) => {

    const {username, password} = req.body;
    try{
        const user = await User.findOne({ username, password });
        if(user) {
           
            return res.status(200).json({ message: 'User found ', data: user });
        }else{
            
        return res.status(404).json({ message: 'User not found'})
    }
    }catch (error) {
        
        return res.status(500).json({ message: 'server error', error: error.message });
    }
}

function mergeSegments(segments) {
    if(segments.length === 0) return [];

    segments.sort((a, b) => a.start - b.start);
    let merged = [segments[0]];
    for(let i =1; i<segments.length; i++) {
        const lastMerged = merged[merged.length - 1];
        const currentSegment = segments[i];

        if(currentSegment.start <= lastMerged.end) {
            lastMerged.end = Math.max(lastMerged.end, currentSegment.end);
        }else{
            merged.push(currentSegment);
        }
    }
    return merged;
}