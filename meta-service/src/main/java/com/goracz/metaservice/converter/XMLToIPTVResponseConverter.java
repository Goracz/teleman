package com.goracz.metaservice.converter;

import com.goracz.metaservice.dto.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collection;

public class XMLToIPTVResponseConverter {
    public static IPTVResponse convertXMLToIPTVResponse(String xml) {
        final IPTVResponse response = new IPTVResponse();
        final Collection<Channel> channels = new ArrayList<>();
        final Collection<Program> programs = new ArrayList<>();

        try {
            final DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            final DocumentBuilder builder = factory.newDocumentBuilder();
            final Document document = builder.parse(new ByteArrayInputStream(xml.getBytes(StandardCharsets.UTF_8)));

            final Element root = document.getDocumentElement();

            // Parse channels
            final NodeList channelNodes = root.getElementsByTagName("channel");
            for (int i = 0; i < channelNodes.getLength(); i++) {
                final Node channelNode = channelNodes.item(i);
                if (channelNode.getNodeType() == Node.ELEMENT_NODE) {
                    final Element channelElement = (Element) channelNode;
                    final Channel channel = new Channel();
                    channel.setId(channelElement.getAttribute("id"));
                    channel.setName(getElementValue(channelElement, "display-name"));
                    channel.setLogo(getElementAttributeValue(channelElement, "icon", "src"));
                    channel.setUrl(getElementValue(channelElement, "url"));
                    channels.add(channel);
                }
            }

            // Parse programs
            final NodeList programNodes = root.getElementsByTagName("programme");
            for (int i = 0; i < programNodes.getLength(); i++) {
                final Node programNode = programNodes.item(i);
                if (programNode.getNodeType() == Node.ELEMENT_NODE) {
                    final Element programElement = (Element) programNode;
                    final Program program = new Program();
                    program.setChannel(programElement.getAttribute("channel"));
                    program.setStart(programElement.getAttribute("start"));
                    program.setStop(programElement.getAttribute("stop"));

                    final Title title = new Title();
                    title.setValue(getElementValue(programElement, "title"));
                    title.setLang(getElementAttributeValue(programElement, "title", "lang"));
                    final Collection<Title> titles = new ArrayList<>();
                    titles.add(title);
                    program.setTitles(titles);

                    final Description description = new Description();
                    description.setValue(getElementValue(programElement, "desc"));
                    description.setLang(getElementAttributeValue(programElement, "desc", "lang"));
                    final Collection<Description> descriptions = new ArrayList<>();
                    descriptions.add(description);
                    program.setDescriptions(descriptions);

                    programs.add(program);
                }
            }

            response.setChannels(channels);
            response.setPrograms(programs);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

    private static String getElementValue(Element parent, String tagName) {
        final NodeList nodeList = parent.getElementsByTagName(tagName);
        if (nodeList.getLength() > 0) {
            final Node node = nodeList.item(0);
            return node.getTextContent();
        }
        return null;
    }

    private static String getElementAttributeValue(Element parent, String tagName, String attributeName) {
        final NodeList nodeList = parent.getElementsByTagName(tagName);
        if (nodeList.getLength() > 0) {
            final Element element = (Element) nodeList.item(0);
            return element.getAttribute(attributeName);
        }
        return null;
    }
}
