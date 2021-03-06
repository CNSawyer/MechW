package com.mechw.entity.payjs;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "payjs_order", catalog = "payjs")
public class PJOrder {

    @Id
    @Column(name = "line_no")
    private Double lineNo;

    @Column(name = "out_trade_no")
    private String outTradeNo;

    @Column(name = "payjs_order_no")
    private String payjsOrderNo;

    @Column(name = "wechat_order_no")
    private String wechatOrderNo;

    @Column(name = "ribbon_name")
    private String ribbonName;

    @Column(name = "title")
    private String title;

    @Column(name = "total_fee")
    private int totalFee;

    @Column(name = "status")
    private int status;

    @Column(name = "canceled")
    private int canceled;

    @Column(name = "dl_link")
    private String dlLink;

    public PJOrder() {
    }

    public PJOrder(Double lineNo, String outTradeNo, String payjsOrderNo, String wechatOrderNo, String ribbonName, String title, int totalFee, int status, int canceled, String dlLink) {
        this.lineNo = lineNo;
        this.outTradeNo = outTradeNo;
        this.payjsOrderNo = payjsOrderNo;
        this.wechatOrderNo = wechatOrderNo;
        this.ribbonName = ribbonName;
        this.title = title;
        this.totalFee = totalFee;
        this.status = status;
        this.canceled = canceled;
        this.dlLink = dlLink;
    }

    public Double getLineNo() {
        return lineNo;
    }

    public void setLineNo(Double lineNo) {
        this.lineNo = lineNo;
    }

    public String getOutTradeNo() {
        return outTradeNo;
    }

    public void setOutTradeNo(String outTradeNo) {
        this.outTradeNo = outTradeNo;
    }

    public String getPayjsOrderNo() {
        return payjsOrderNo;
    }

    public void setPayjsOrderNo(String payjsOrderNo) {
        this.payjsOrderNo = payjsOrderNo;
    }

    public String getWechatOrderNo() {
        return wechatOrderNo;
    }

    public void setWechatOrderNo(String wechatOrderNo) {
        this.wechatOrderNo = wechatOrderNo;
    }

    public String getRibbonName() {
        return ribbonName;
    }

    public void setRibbonName(String ribbonName) {
        this.ribbonName = ribbonName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getTotalFee() {
        return totalFee;
    }

    public void setTotalFee(int totalFee) {
        this.totalFee = totalFee;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getCanceled() {
        return canceled;
    }

    public void setCanceled(int canceled) {
        this.canceled = canceled;
    }

    public String getDlLink() {
        return dlLink;
    }

    public void setDlLink(String dlLink) {
        this.dlLink = dlLink;
    }
}
