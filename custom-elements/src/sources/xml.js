export const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1k5z620" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="3.2.1">
  <bpmn:process id="Process_1es96k8" isExecutable="false">
    <bpmn:startEvent id="StartEvent_0e7ldi9">
      <bpmn:outgoing>SequenceFlow_0ce4pox</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0ce4pox" sourceRef="StartEvent_0e7ldi9" targetRef="Task_10e019c" />
    <bpmn:sequenceFlow id="SequenceFlow_0zsoo0i" sourceRef="Task_10e019c" targetRef="Task_03vskbz" />
    <bpmn:endEvent id="EndEvent_0ftu09i">
      <bpmn:incoming>SequenceFlow_1bmvoft</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1bmvoft" sourceRef="Task_03vskbz" targetRef="EndEvent_0ftu09i" />
    <bpmn:userTask id="Task_10e019c">
      <bpmn:incoming>SequenceFlow_0ce4pox</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0zsoo0i</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:serviceTask id="Task_03vskbz">
      <bpmn:incoming>SequenceFlow_0zsoo0i</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1bmvoft</bpmn:outgoing>
    </bpmn:serviceTask>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1es96k8">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_0e7ldi9">
        <dc:Bounds x="156" y="81" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0ce4pox_di" bpmnElement="SequenceFlow_0ce4pox">
        <di:waypoint x="192" y="99" />
        <di:waypoint x="242" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0zsoo0i_di" bpmnElement="SequenceFlow_0zsoo0i">
        <di:waypoint x="342" y="99" />
        <di:waypoint x="392" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_0ftu09i_di" bpmnElement="EndEvent_0ftu09i">
        <dc:Bounds x="542" y="81" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1bmvoft_di" bpmnElement="SequenceFlow_1bmvoft">
        <di:waypoint x="492" y="99" />
        <di:waypoint x="542" y="99" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="UserTask_0gwf0ra_di" bpmnElement="Task_10e019c">
        <dc:Bounds x="242" y="59" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ServiceTask_1etnxmm_di" bpmnElement="Task_03vskbz">
        <dc:Bounds x="392" y="59" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
