import ILockAdapter from './ILockAdapter';
import LockMapper from './LockMapper';

import LockModelSequelize from '../../../database/models/Lock';

import Lock from '../../domain/Lock';

class LockAdapter implements ILockAdapter {

  public async exists(lock: Lock): Promise<boolean> {;
    const result = await LockModelSequelize.findOne({
      where: { id: lock.getId() },
    });

    return !!result === true;
  }

  public async delete(lock: Lock): Promise<boolean> { 
    const result = await LockModelSequelize.destroy({ 
      where: { id: lock.getId() } 
    });

    return !!result;
  }

  public async save(lock: Lock): Promise<Lock> {
    const rawLock = LockMapper.toPersistence(lock);

    const dbLock = await LockModelSequelize.create(rawLock);

    return LockMapper.toDomain(dbLock);
  }

  public async update(lock: Lock): Promise<Lock> {
    const updatedRows = await LockModelSequelize.update(LockMapper.toPersistence(lock), { 
      where: { id: lock.getId() }, 
    });

    return (updatedRows[0] > 0 ? LockMapper.toDomain(lock) : null);
  }

  public async getById(lockId: string): Promise<Lock> {
    const result = await LockModelSequelize.findOne({
      where: { id: lockId },
    });

    return LockMapper.toDomain(result);
  }
  
  public async getLockById(lockId: string): Promise<Lock> {
    return await this.getById(lockId);
  }

  public async findAll(houseId: string): Promise<Lock[]> {
    return await this.findAllLocksByHouseId(houseId); 
  }

  public async findAllLocksByHouseId(houseId: string): Promise<Lock[]> { 

    const result = await LockModelSequelize.findAll({
      where: {
        houseId: houseId,
      },
      order: [
        ['name', 'ASC'],
      ]
    });

    const locks: Lock[] = result.map(lock => LockMapper.toDomain(lock));

    return locks;
  }
}

export default LockAdapter;