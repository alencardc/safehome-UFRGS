import { Request, Response } from 'express';

import HouseService from '../services/HouseService';
import NotificationService from '../services/NotificationService';
import Notification from '../models/Notification';
import House from '../models/House';

class NotificationController {
  public async index(req: Request, res: Response): Promise<Response> {

    const notifications: Notification[] = await NotificationService.getAll(req.params.userId);

    if (notifications === null) {
      return res.status(400).json({error: 'Unable to get any notification.'});
    }

    return res.json(notifications);
  }

  public async store(req: Request, res: Response): Promise<Response> {

    const { type, houseId, deviceId } = req.body;

    const notification: Notification = await NotificationService.sendNotification(type, houseId, deviceId);
    await HouseService.manageAlert(type, houseId, false);
     

    if (notification === null) {
      return res.status(400).json({error: 'Unable to send notification.'});
    }

    return res.json(notification);
  }

  public async update(req: Request, res: Response): Promise<Response> {

    const { notificationId, falseAlert, read } = req.body;

    const notification: Notification = await NotificationService.updateStatus(notificationId, req.userId, falseAlert, read);
    const house: House = await HouseService.getHouseByUserId(req.userId);
    await HouseService.manageAlert(notification.getType(), house.getId(), falseAlert);

    if (notification === null) {
      return res.status(400).json({error: 'Unable to update the notification.'});
    }

    return res.json(notification);
  }
}

export default NotificationController;