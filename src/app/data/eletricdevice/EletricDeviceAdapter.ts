import IEletricDevice from './IEletricDeviceAdapter';
import EletricDeviceMapper from './EletricDeviceMapper';

import EletricDeviceModelSequelize from '../../../database/models/EletricDevice';

import EletricDevice from '../../domain/EletricDevice';

class EletricDeviceAdapter implements IEletricDevice {

  public async exists(eletricDevice: EletricDevice): Promise<boolean> {;
    const result = await EletricDeviceModelSequelize.findOne({
      where: { id: eletricDevice.getId() },
    });

    return !!result === true;
  }

  public async delete(eletricDevice: EletricDevice): Promise<boolean> { 
    const result = await EletricDeviceModelSequelize.destroy({ 
      where: { id: eletricDevice.getId() } 
    });

    return !!result;
  }

  public async save(eletricDevice: EletricDevice): Promise<EletricDevice> {
    const rawEletricDevice = EletricDeviceMapper.toPersistence(eletricDevice);

    const dbEletricDevice = await EletricDeviceModelSequelize.create(rawEletricDevice);

    return EletricDeviceMapper.toDomain(dbEletricDevice);
  }

  public async update(eletricDevice: EletricDevice): Promise<EletricDevice> {
    const updatedRows = await EletricDeviceModelSequelize.update(EletricDeviceMapper.toPersistence(eletricDevice), { 
      where: { id: eletricDevice.getId() }, 
    });

    return (updatedRows[0] > 0 ? EletricDeviceMapper.toDomain(eletricDevice) : null);
  }

  public async getById(eletricDeviceId: string): Promise<EletricDevice> {
    const result = await EletricDeviceModelSequelize.findOne({
      where: { id: eletricDeviceId },
    });

    return EletricDeviceMapper.toDomain(result);
  }
  
  public async getEletricDeviceById(eletricDeviceId: string): Promise<EletricDevice> {
    return await this.getById(eletricDeviceId);
  }

  public async findAll(houseId: string): Promise<EletricDevice[]> {
    return await this.findAllEletricDevicesByHouseId(houseId)
  }

  public async findAllEletricDevicesByHouseId(houseId: string): Promise<EletricDevice[]> { 

    const result = await EletricDeviceModelSequelize.findAll({
      where: {
        houseId: houseId,
      },
      order: [
        ['name', 'ASC'],
      ]
    });

    const eletricDevices: EletricDevice[] = result.map(eletricDevice => EletricDeviceMapper.toDomain(eletricDevice));

    return eletricDevices;
  }
}

export default EletricDeviceAdapter;