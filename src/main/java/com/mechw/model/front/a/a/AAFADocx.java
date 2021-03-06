package com.mechw.model.front.a.a;

public class AAFADocx {

    private String ribbonName;

    // 设计压力
    private Double designPressure;

    // 设计温度
    private Double designTemp;

    // 静压力
    private Double staticPressure;

    // 材料标准号
    private String std;

    // 材料名称
    private String name;

    // 腐蚀裕量
    private Double c2;

    // 焊接接头系数
    private Double e;

    // 大端内直径
    private Double largeInnerDiameter;

    // 小端内直径
    private Double smallInnerDiameter;

    // 半顶角 α
    private Double a;

    // 名义厚度
    private Double thkn;

    // 压力试验类型
    private String test;

    // 密度
    private Double density;

    // 试验温度下屈服点
    private Double testRel;

    // 负偏差
    private Double c1;

    // 设计应力
    private Double designStress;

    // 试验应力
    private Double testStress;

    // 标记应力
    private Double tagStress;

    // 厚度附加量
    private Double c;

    // 有效厚度
    private Double thke;

    // 计算压力
    private Double calPressure;

    // 计算厚度
    private Double thkc;

    // 设计厚度
    private Double thkd;

    // 厚度校核结果
    private String thkChk;

    // 试验压力
    private Double testPressure;

    // MAWP
    private Double mawp;

    // 内表面积
    private Double ai;

    // 外表面积
    private Double ao;

    // 内容积
    private Double vi;

    // 重量
    private Double m;

    public AAFADocx() {
    }

    public AAFADocx(String ribbonName, Double designPressure, Double designTemp, Double staticPressure, String std, String name, Double c2, Double e, Double largeInnerDiameter, Double smallInnerDiameter, Double a, Double thkn, String test, Double density, Double testRel, Double c1, Double designStress, Double testStress, Double tagStress, Double c, Double thke, Double calPressure, Double thkc, Double thkd, String thkChk, Double testPressure, Double mawp, Double ai, Double ao, Double vi, Double m) {
        this.ribbonName = ribbonName;
        this.designPressure = designPressure;
        this.designTemp = designTemp;
        this.staticPressure = staticPressure;
        this.std = std;
        this.name = name;
        this.c2 = c2;
        this.e = e;
        this.largeInnerDiameter = largeInnerDiameter;
        this.smallInnerDiameter = smallInnerDiameter;
        this.a = a;
        this.thkn = thkn;
        this.test = test;
        this.density = density;
        this.testRel = testRel;
        this.c1 = c1;
        this.designStress = designStress;
        this.testStress = testStress;
        this.tagStress = tagStress;
        this.c = c;
        this.thke = thke;
        this.calPressure = calPressure;
        this.thkc = thkc;
        this.thkd = thkd;
        this.thkChk = thkChk;
        this.testPressure = testPressure;
        this.mawp = mawp;
        this.ai = ai;
        this.ao = ao;
        this.vi = vi;
        this.m = m;
    }

    public String getRibbonName() {
        return ribbonName;
    }

    public void setRibbonName(String ribbonName) {
        this.ribbonName = ribbonName;
    }

    public Double getDesignPressure() {
        return designPressure;
    }

    public void setDesignPressure(Double designPressure) {
        this.designPressure = designPressure;
    }

    public Double getDesignTemp() {
        return designTemp;
    }

    public void setDesignTemp(Double designTemp) {
        this.designTemp = designTemp;
    }

    public Double getStaticPressure() {
        return staticPressure;
    }

    public void setStaticPressure(Double staticPressure) {
        this.staticPressure = staticPressure;
    }

    public String getStd() {
        return std;
    }

    public void setStd(String std) {
        this.std = std;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getC2() {
        return c2;
    }

    public void setC2(Double c2) {
        this.c2 = c2;
    }

    public Double getE() {
        return e;
    }

    public void setE(Double e) {
        this.e = e;
    }

    public Double getLargeInnerDiameter() {
        return largeInnerDiameter;
    }

    public void setLargeInnerDiameter(Double largeInnerDiameter) {
        this.largeInnerDiameter = largeInnerDiameter;
    }

    public Double getSmallInnerDiameter() {
        return smallInnerDiameter;
    }

    public void setSmallInnerDiameter(Double smallInnerDiameter) {
        this.smallInnerDiameter = smallInnerDiameter;
    }

    public Double getA() {
        return a;
    }

    public void setA(Double a) {
        this.a = a;
    }

    public Double getThkn() {
        return thkn;
    }

    public void setThkn(Double thkn) {
        this.thkn = thkn;
    }

    public String getTest() {
        return test;
    }

    public void setTest(String test) {
        this.test = test;
    }

    public Double getDensity() {
        return density;
    }

    public void setDensity(Double density) {
        this.density = density;
    }

    public Double getTestRel() {
        return testRel;
    }

    public void setTestRel(Double testRel) {
        this.testRel = testRel;
    }

    public Double getC1() {
        return c1;
    }

    public void setC1(Double c1) {
        this.c1 = c1;
    }

    public Double getDesignStress() {
        return designStress;
    }

    public void setDesignStress(Double designStress) {
        this.designStress = designStress;
    }

    public Double getTestStress() {
        return testStress;
    }

    public void setTestStress(Double testStress) {
        this.testStress = testStress;
    }

    public Double getTagStress() {
        return tagStress;
    }

    public void setTagStress(Double tagStress) {
        this.tagStress = tagStress;
    }

    public Double getC() {
        return c;
    }

    public void setC(Double c) {
        this.c = c;
    }

    public Double getThke() {
        return thke;
    }

    public void setThke(Double thke) {
        this.thke = thke;
    }

    public Double getCalPressure() {
        return calPressure;
    }

    public void setCalPressure(Double calPressure) {
        this.calPressure = calPressure;
    }

    public Double getThkc() {
        return thkc;
    }

    public void setThkc(Double thkc) {
        this.thkc = thkc;
    }

    public Double getThkd() {
        return thkd;
    }

    public void setThkd(Double thkd) {
        this.thkd = thkd;
    }

    public String getThkChk() {
        return thkChk;
    }

    public void setThkChk(String thkChk) {
        this.thkChk = thkChk;
    }

    public Double getTestPressure() {
        return testPressure;
    }

    public void setTestPressure(Double testPressure) {
        this.testPressure = testPressure;
    }

    public Double getMawp() {
        return mawp;
    }

    public void setMawp(Double mawp) {
        this.mawp = mawp;
    }

    public Double getAi() {
        return ai;
    }

    public void setAi(Double ai) {
        this.ai = ai;
    }

    public Double getAo() {
        return ao;
    }

    public void setAo(Double ao) {
        this.ao = ao;
    }

    public Double getVi() {
        return vi;
    }

    public void setVi(Double vi) {
        this.vi = vi;
    }

    public Double getM() {
        return m;
    }

    public void setM(Double m) {
        this.m = m;
    }

}
