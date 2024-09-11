import express, { Request, Response } from 'express';
import { UserInfo } from '../schema/userInfo'; // Ensure the correct model is used

const router = express.Router();

router.put('/', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, updatedInfo } = req.body;
    const currentUserId = req.session.user.userId;

    if (userId !== currentUserId) {
        return res.status(403).json({ message: 'Forbidden: Cannot update other users' });
    }

    if ('userId' in updatedInfo) {
        return res.status(400).json({ message: 'Cannot change userId.' });
    }

    // Exclude the password field from the update
    const { password, ...infoToUpdate } = updatedInfo;

    try {
        const user = await UserInfo.findOneAndUpdate(
            { userId },
            { $set: infoToUpdate },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User info updated successfully.', userInfo: user });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Failed to update user info.' });
    }
});

export default router;
