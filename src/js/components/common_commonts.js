import React from 'react';

import {Menu, Col, Tabs, Row, Form, Input, Button, Card, notification} from 'antd';

const {TextArea} = Input;
const FormItem = Form.Item;
const MenuItem = Menu.Item;
const TabPane = Tabs.TabPane;
import {Router, Route, Link, browserHistory, HashRouter} from 'react-router-dom'

class CommonComments extends React.Component {
    constructor() {
        super();
        this.state = {
            comments: ''
            // collect:'收藏该文章'
        }
    }
    componentDidMount() {
        var myFetchOptions = {
            method: 'GET'
        };
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getcomments&uniquekey=" +
            this.props.uniquekey, myFetchOptions)
            .then(response => response.json())
            .then(json => {
                this.setState({comments: json});
            });
    };

    handleSubmit(e) {
        e.preventDefault();
        var myFetchOptions = {
            method: 'GET'
        };
        var formdata = this.props.form.getFieldsValue();
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=comment&" +
            "userid=" + localStorage.userid +
            "&uniquekey=" + this.props.uniquekey +
            "&comment=" + formdata.remark, myFetchOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                console.log(1);
                this.componentDidMount();
            })
    }
    addUserCollection(){
        var myFetchOption = {
            method : 'GET'
        };
        if(localStorage.userid){
            fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=uc&userid="+localStorage.userid+"&uniquekey"+this.props.uniquekey,myFetchOption)
                .then(response => response.json())
                .then(json =>{
                    //收藏成功以后进行一下全局的提醒
                    notification['success']({message: 'ReactNews提醒', description: '收藏此文章成功'});

                })
        }else{
            notification['error']({message: 'ReactNews提醒', description: '请先登陆账号'});
        }

    }
    render() {
        let {getFieldProps} = this.props.form;
        const {comments} = this.state;
        const commentsList = comments.length ?
            comments.map((comment, index) => (
                <Card key={index} title={comment.UserName} extra={< a href="#"> 发布于 {comment.datetime} </a>}>
                    <p>{comment.Comments}</p>
                </Card>
            ))
            :
            "没有加载到任何评论"
        ;
        return (
            <div className="comment">
                <Row>
                    <Col span={24}>
                        {commentsList}
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                            <FormItem label={"您的评论"}>
                                <TextArea type="textarea" placeholder={"请输入评论内容"}
                                          {...getFieldProps('remark', {initialValue: ''})}/>
                            </FormItem>
                            <Button type="primary" htmlType="submit">提交评论</Button>
                            &nbsp;&nbsp;
                            <Button type="primary" htmlType="button" onClick={this.addUserCollection.bind(this)}>收藏该文章</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CommonComments = Form.create({})(CommonComments);