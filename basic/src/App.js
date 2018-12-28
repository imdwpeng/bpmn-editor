import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { HashRouter, Link, Route } from 'react-router-dom';
import EditorBasic from './containers/EditorBasic';
import './App.css';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const urlData = {
  editorBasic: ''
};

const codeData = {
  editorBasic: '<div>123456</div>'
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      item: ''
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  handleSelectItme = (params) => {
    const { key } = params;
    this.setState({
      item: key
    });
  }

  render() {
    const { item } = this.state;

    return (
      <HashRouter>
        <Layout style={{ height: '100%' }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <Menu
              defaultSelectedKeys={['basic']}
              defaultOpenKeys={['viewer', 'editor']}
              mode="inline"
              theme="dark"
              inlineCollapsed={this.state.collapsed}
              onSelect={this.handleSelectItme}
            >
              <SubMenu
                key="viewer"
                title={
                  <span>
                    <Icon type="smile" />
                    <span>显示界面</span>
                  </span>}
              >
                <Menu.Item key="basic">基本显示</Menu.Item>
                <Menu.Item key="6">当前步骤</Menu.Item>
              </SubMenu>
              <SubMenu
                key="editor"
                title={
                  <span>
                    <Icon type="smile" />
                    <span>组态界面</span>
                  </span>}
              >
                <Menu.Item key="editorBasic"><Link to="/editor/basic">基本用法</Link></Menu.Item>
                <Menu.Item key="editorTools">工具栏</Menu.Item>
                <Menu.Item key="editorPalette">控制板</Menu.Item>
                <Menu.Item key="editorMenu">菜单项</Menu.Item>
              </SubMenu>
              <Menu.Item key="i18n">国际化</Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content style={{ display: 'flex', flexDirection: 'column', margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <h3><a href={urlData[item]}>源码地址</a></h3>
              <h3>依赖包</h3>
              <pre>
                <code dangerouslySetInnerHTML={{ __html: codeData[item] }} />
              </pre>
              <div style={{ position: 'relative', flex: 'auto' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
                  <Route exact path="/" component={() => { return (<span>q2</span>); }} />
                  <Route path="/editor/basic" component={EditorBasic} />
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </HashRouter>
    );
  }
}

export default App;
