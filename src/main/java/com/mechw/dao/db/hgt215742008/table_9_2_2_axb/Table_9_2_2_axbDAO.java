package com.mechw.dao.db.hgt215742008.table_9_2_2_axb;


import com.mechw.entity.db.hgt215742008.Table_9_2_2_axb;

import java.util.List;

public interface Table_9_2_2_axbDAO {

    // 列出所有可用的DN
    List<Float> listDN();

    // 查找指定DN，大于所要求吊重的所有 Type 型号
    List<Float> findTypesByDNAndLiftWeight(Float dn, Float liftWeight);

    // 根据指定DN、实际吊重、Type型号，获取满足要求的最小吊重的对象
    Table_9_2_2_axb findByDNAndLiftWeightAndType(Float dn, Float liftWeight, Float type);

}
