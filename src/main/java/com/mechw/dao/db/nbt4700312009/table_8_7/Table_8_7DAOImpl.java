package com.mechw.dao.db.nbt4700312009.table_8_7;

import com.mechw.entity.db.nbt4700312009.table.Table_8_7;
import com.mechw.model.db.nbt4700312009.table.table_8_7.Table_8_7_Query;
import com.mechw.model.db.nbt4700312009.table.table_8_7.Table_8_7_Result;
import com.mechw.service.Array;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.NativeQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Transactional
@Repository("Table_8_7DAO")
public class Table_8_7DAOImpl implements Table_8_7DAO {

    @Resource
    private SessionFactory sessionFactory;

    private Session getSession() {
        return this.sessionFactory.getCurrentSession();
    }

    @Override
    public Table_8_7_Result findAlphaAndBeta(Table_8_7_Query table_8_7_query) {

        double ba = 10 * table_8_7_query.getBa();

        Table_8_7_Result table_8_7_result;

        if (ba < 1 || ba > 50) {

            table_8_7_result = new Table_8_7_Result(-1.0, -1.0);

        } else {

            // 获取 ba 数组
            String sql_ba = "SELECT DISTINCT ba FROM nbt_47003_1_2009.table_8_7 ORDER BY ba";
            NativeQuery query_ba = this.getSession().createNativeQuery(sql_ba);
            Object[] baList = query_ba.list().toArray();
            double[] baArray = new double[baList.length];
            for (int i = 0; i < baList.length; i++) {
                baArray[i] = (double) baList[i];
            }

            // 如果设备直径恰好是节点值
            if (Array.isContains(baArray, ba)) {

                String sql_1 = "SELECT * FROM nbt_47003_1_2009.table_8_7 " +
                        "WHERE ba = :ba_param";
                NativeQuery query_1 = this.getSession().createNativeQuery(sql_1).addEntity(Table_8_7.class).setParameter("ba_param", ba);
                Table_8_7 table_8_7 = (Table_8_7) query_1.list().get(0);

                table_8_7_result = new Table_8_7_Result(table_8_7.getAlpha(), table_8_7.getBeta());


            } else {

                // 获取给定 ba 的上下边界值
                double baUpperMin = Array.getUpper(baArray, ba);
                String sql_UpperMin = "SELECT * FROM nbt_47003_1_2009.table_8_7 " +
                        "WHERE ba = :ba_param";
                NativeQuery query_UpperMin = this.getSession().createNativeQuery(sql_UpperMin).addEntity(Table_8_7.class).setParameter("ba_param", baUpperMin);
                Table_8_7 table_8_7_UpperMin = (Table_8_7) query_UpperMin.list().get(0);

                double baLowerMax = Array.getLower(baArray, ba);
                String sql_LowerMax = "SELECT * FROM nbt_47003_1_2009.table_8_7 " +
                        "WHERE ba = :ba_param";
                NativeQuery query_LowerMax = this.getSession().createNativeQuery(sql_LowerMax).addEntity(Table_8_7.class).setParameter("ba_param", baLowerMax);
                Table_8_7 table_8_7_LowerMax = (Table_8_7) query_LowerMax.list().get(0);

                double lma = table_8_7_LowerMax.getAlpha();
                double lmb = table_8_7_LowerMax.getBeta();

                double uma = table_8_7_UpperMin.getAlpha();
                double umb = table_8_7_UpperMin.getBeta();


                double alpha = lma + (ba - baLowerMax) / (baUpperMin - baLowerMax) * (uma - lma);
                double beta = lmb + (ba - baLowerMax) / (baUpperMin - baLowerMax) * (umb - lmb);

                table_8_7_result = new Table_8_7_Result(alpha, beta);

            }
        }

        return table_8_7_result;
    }

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

}
